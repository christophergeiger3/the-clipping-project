import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { interval, map, Observable } from 'rxjs';
import { ClipsService } from './clips.service';
import { CreateClipDto } from './dto/create-clip.dto';
import { UpdateClipDto } from './dto/update-clip.dto';
import { Clip } from './schema/clip.schema';

@ApiTags('clips')
@Controller('clips')
export class ClipsController {
  constructor(private readonly clipsService: ClipsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a clip' })
  @ApiBody({ type: CreateClipDto })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created',
    type: Clip,
  })
  async create(@Body() createClipDto: CreateClipDto): Promise<Clip> {
    return this.clipsService.create(createClipDto);
  }

  @Get()
  @ApiOperation({ summary: 'Return all clips' })
  @ApiResponse({
    status: 200,
    description: 'The records have been successfully returned',
    type: Clip,
    isArray: true,
  })
  async findAll(): Promise<Clip[]> {
    return this.clipsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Return a single clip' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully returned',
    type: Clip,
  })
  findOne(@Param('id') id: ObjectId): Promise<Clip> {
    return this.clipsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a clip' })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiBody({ type: UpdateClipDto })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully updated',
    type: Clip,
  })
  update(
    @Param('id') id: ObjectId,
    @Body() updateClipDto: UpdateClipDto,
  ): Promise<Clip> {
    return this.clipsService.update(id, updateClipDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a clip' })
  @ApiParam({ name: 'id', type: String })
  remove(@Param('id') id: ObjectId) {
    return this.clipsService.remove(id);
  }

  // TODO: Pass MessageEvent generic type
  @Sse(':id/progress')
  @ApiOperation({ summary: 'Stream progress of a clip' })
  @ApiParam({ name: 'id', type: String })
  progress(@Param('id') id: ObjectId): Observable<MessageEvent> {
    return interval(1000).pipe(
      map(
        () =>
          ({
            data: { progress: this.clipsService.progress(id) },
          } as MessageEvent),
      ),
    );
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Sse,
  UseGuards,
  ConflictException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { interval, map, Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ClipsService } from './clips.service';
import { CreateClipDto } from './dto/create-clip.dto';
import { UpdateClipDto } from './dto/update-clip.dto';
import { Clip } from './schema/clip.schema';

const ONE_SECOND = 1000;

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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createClipDto: CreateClipDto): Promise<Clip> {
    const isClipWithSameName = await this.clipsService.isAnyClipWithName(
      createClipDto.name,
    );

    if (isClipWithSameName) {
      throw new ConflictException(
        `A clip with name ${createClipDto.name} already exists`,
      );
    }

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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: ObjectId): Promise<Clip | null> {
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: ObjectId,
    @Body() updateClipDto: UpdateClipDto,
  ): Promise<Clip | null> {
    return this.clipsService.update(id, updateClipDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a clip' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully deleted',
    type: Clip,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: ObjectId) {
    return this.clipsService.remove(id);
  }

  // For now this is a public endpoint
  @Sse(':id/progress')
  @ApiOperation({
    summary: 'Stream progress of a clip as an integer from 0 - 100',
  })
  @ApiParam({ name: 'id', type: String })
  progress(@Param('id') id: ObjectId): Observable<MessageEvent> {
    return interval(ONE_SECOND).pipe(
      map(
        () =>
          ({
            data: { progress: this.clipsService.progress(id) },
          } as MessageEvent),
      ),
    );
  }
}

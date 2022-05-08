import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully returned',
    type: CreateClipDto,
  })
  findOne(@Param('id') id: string) {
    return this.clipsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClipDto: UpdateClipDto) {
    return this.clipsService.update(+id, updateClipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clipsService.remove(+id);
  }
}

import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateClipDto } from './dto/create-clip.dto';
import { Clip, ClipDocument } from './schema/clip.schema';
import ClipCreatedEvent from './events/clip-created.event';
import { AnalyzeService } from '../analyze/analyze.service';

@Injectable()
export class ClipsService {
  /** Clips currently being processed (clip.status = 'processing') */
  activeClips: ClipCreatedEvent[] = [];

  constructor(
    @InjectModel(Clip.name) private readonly clipModel: Model<Clip>,
    private readonly analyzeService: AnalyzeService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createClipDto: CreateClipDto): Promise<Clip> {
    const createdClip = await this.clipModel.create({
      ...createClipDto,
      // Call the analyze service here to grab actual URL from youtube-dl
      analyzedUrl: (await this.analyzeService.analyze(createClipDto.url))[0],
    });

    Logger.log(`Emitting event clip.created for ${createdClip.url}`);
    this.eventEmitter.emit('clip.created', new ClipCreatedEvent(createdClip));

    return createdClip;
  }

  async findAll(): Promise<Clip[]> {
    const clips = await this.clipModel.find();
    return clips;
  }

  async findOne(id: ObjectId): Promise<ClipDocument> {
    return this.clipModel.findById(id);
  }

  async update(
    id: ObjectId,
    update: Partial<ClipDocument>,
  ): Promise<ClipDocument> {
    return this.clipModel.findByIdAndUpdate(id, update, {
      new: true,
    });
  }

  async remove(id: ObjectId): Promise<ClipDocument> {
    return this.clipModel.findByIdAndDelete(id);
  }
}

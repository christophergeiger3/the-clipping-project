import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateClipDto } from './dto/create-clip.dto';
import { Clip, ClipDocument } from './schema/clip.schema';
import ClipCreatedEvent from './events/clip-created.event';
import { AnalyzeService } from '../analyze/analyze.service';
import { unlinkSync } from 'fs';

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

  private deleteFile(file: string): void {
    Logger.log(`Deleting file ${file}`);
    try {
      unlinkSync(file);
    } catch (err) {
      Logger.error(`Error deleting file ${file}`);
      Logger.error(err);
    }
  }

  /** Kills clip.child if the clip is active */
  forceStopClipTranscode(id: ObjectId | string): void {
    const clip = this.findActiveClipById(id);
    if (clip) {
      Logger.log(`Force stopping clip ${id}`);
      clip.child.kill();
    }
  }

  async remove(id: ObjectId): Promise<ClipDocument> {
    const clip = await this.clipModel.findByIdAndDelete(id);
    this.forceStopClipTranscode(id);
    this.setInactive(id);
    this.deleteFile(clip.output);
    return clip;
  }

  /** @returns Index or -1 if clip not found */
  findActiveClipIndexById(id: ObjectId | string): number {
    if (typeof id !== 'string') {
      id = id.toString();
    }
    return this.activeClips.findIndex((c) => c._id.toString() === id);
  }

  findActiveClipById(id: ObjectId | string): ClipCreatedEvent | undefined {
    const index = this.findActiveClipIndexById(id);
    if (index === -1) {
      return undefined;
    }
    return this.activeClips[index];
  }

  /** Add clip to activeClips list */
  setActive(clip: ClipCreatedEvent): void {
    this.activeClips.push(clip);
  }

  /** Remove clip from activeClips list */
  setInactive(id: ObjectId | string): void {
    const index = this.findActiveClipIndexById(id);
    if (index !== -1) {
      this.activeClips.splice(index, 1);
    }
  }

  /** @returns Percent from 0 to 100 or -1 if clip not active */
  progress(id: ObjectId | string): number {
    const clip = this.findActiveClipById(id);
    return clip ? clip.percentDone : -1;
  }
}

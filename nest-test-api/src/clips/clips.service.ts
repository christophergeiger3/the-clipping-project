import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CreateClipDto } from './dto/create-clip.dto';
import { UpdateClipDto } from './dto/update-clip.dto';
import { Clip, ClipDocument } from './schema/clip.schema';
import ClipCreatedEvent from './events/clip-created.event';

@Injectable()
export class ClipsService {
  constructor(
    @InjectModel(Clip.name) private readonly clipModel: Model<Clip>,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createClipDto: CreateClipDto): Promise<Clip> {
    const createdClip = await this.clipModel.create(createClipDto);

    Logger.log('Emitting event');
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
    updateClipDto: UpdateClipDto,
  ): Promise<ClipDocument> {
    return this.clipModel.findByIdAndUpdate(id, updateClipDto, {
      new: true,
    });
  }

  async remove(id: ObjectId): Promise<ClipDocument> {
    return this.clipModel.findByIdAndDelete(id);
  }
}

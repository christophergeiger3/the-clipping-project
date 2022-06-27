import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, ObjectId } from 'mongoose';

export type ClipDocument = ClipBaseSchema & Document;

export enum Status {
  Done = 'done',
  Error = 'error',
  Idle = 'idle',
  Processing = 'processing',
}

@Schema({ timestamps: true, collection: 'clips' })
export class ClipBaseSchema {
  @Prop({ required: true })
  @ApiProperty()
  url: string;

  @Prop({ required: true })
  @ApiProperty()
  start: number;

  @Prop({ required: true })
  @ApiProperty()
  end: number;

  @Prop({ required: true })
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  status: Status;

  @Prop()
  @ApiProperty({
    description: 'Resulting URL from passing clip.url to yt-dlp --get-video',
  })
  analyzedUrl: string;

  @Prop({ required: false })
  @ApiProperty({
    description: 'Filename of the clip video, if one exists',
    example: 'big-buck-bunny.mp4',
  })
  filename?: string;

  constructor(clip?: ClipBaseSchema) {
    if (clip) {
      this.start = clip.start;
      this.end = clip.end;
      this.analyzedUrl = clip.analyzedUrl;
      this.url = clip.url;
      this.name = clip.name;
      this.status = clip.status;
      this.filename = clip.filename;
    }
  }
}

/** Helper class with additional properties such as _id, createdAt, updatedAt, added to the schema */
export class Clip extends ClipBaseSchema {
  @ApiProperty({ type: String })
  _id: ObjectId;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;

  constructor(clip?: Clip) {
    super(clip);
    if (clip) {
      this._id = clip._id;
      this.createdAt = clip.createdAt;
      this.updatedAt = clip.updatedAt;
    }
  }
}

export const ClipSchema = SchemaFactory.createForClass(ClipBaseSchema);

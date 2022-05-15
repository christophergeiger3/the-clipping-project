import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ClipDocument = Clip & Document;

export enum Status {
  Done = 'done',
  Error = 'error',
  Idle = 'idle',
  Processing = 'processing',
}

@Schema({ timestamps: true })
export class Clip {
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
  output: string;

  @Prop()
  status: Status;

  @Prop()
  analyzedUrl: string;

  constructor(clip?: Clip) {
    if (clip) {
      this.start = clip.start;
      this.end = clip.end;
      this.analyzedUrl = clip.analyzedUrl;
      this.url = clip.url;
      this.output = clip.output;
      this.status = clip.status;
    }
  }
}

export const ClipSchema = SchemaFactory.createForClass(Clip);

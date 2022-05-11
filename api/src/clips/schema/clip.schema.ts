import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ClipDocument = Clip & Document;

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
  status: string;

  constructor(clip?: Clip) {
    if (clip) {
      this.start = clip.start;
      this.end = clip.end;
      this.url = clip.url;
      this.output = clip.output;
      this.status = clip.status;
    }
  }
}

export const ClipSchema = SchemaFactory.createForClass(Clip);

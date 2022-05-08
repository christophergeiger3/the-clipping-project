import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ClipDocument = Clip & Document;

@Schema({ timestamps: true })
export class Clip {
  @Prop()
  name: string;
}

export const ClipSchema = SchemaFactory.createForClass(Clip);

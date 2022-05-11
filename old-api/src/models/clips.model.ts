import { Clip } from '@/interfaces/clips.interface';
import { model, Schema, Document } from 'mongoose';

// TODO: add createdAt
const clipSchema: Schema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    output: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const clipModel = model<Clip & Document>('Clip', clipSchema);

export default clipModel;

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, ObjectId } from 'mongoose';

export type UserDocument = UserBaseSchema & Document;

@Schema({ timestamps: true, collection: 'users' })
export class UserBaseSchema {
  @Prop({ required: true })
  @ApiProperty()
  username: string;

  @Prop({ required: true })
  password: string;
}

/** Helper class with additional properties such as _id, createdAt, updatedAt, added to the schema */
export class User extends UserBaseSchema {
  @ApiProperty({ type: String })
  _id: ObjectId;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserBaseSchema);

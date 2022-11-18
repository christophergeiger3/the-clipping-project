import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';

export const UserRole = {
  owner: 'owner',
  admin: 'admin',
  user: 'user',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

@Schema({ timestamps: true, collection: 'users' })
export class UserBaseSchema {
  @Prop({ required: true })
  @ApiProperty()
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: UserRole.user })
  @ApiProperty({ enum: UserRole })
  role: UserRole;
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

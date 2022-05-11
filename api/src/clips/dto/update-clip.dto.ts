import { PartialType } from '@nestjs/mapped-types';
import { CreateClipDto } from './create-clip.dto';

export class UpdateClipDto extends PartialType(CreateClipDto) {}

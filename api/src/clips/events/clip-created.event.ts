import { Clip } from '../schema/clip.schema';
import { Injectable } from '@nestjs/common';
import { ChildProcess } from 'child_process';
import { ObjectId } from 'mongoose';
import { join } from 'path';
import convertToSeconds from '../utils/convertToSeconds';

@Injectable()
class ClipCreatedEvent extends Clip {
  _id: ObjectId;
  child: ChildProcess;
  args: string[];
  /** Integer (0 - 100) of how much of the clip has been processed in ffmpeg */
  percentDone: number;

  constructor(clip: Clip) {
    super(clip);
    this.percentDone = 0;
    this.args = [
      '--force-overwrites',
      '--progress',
      '--newline', // output progress bar on newlines
      '--download-sections',
      `'*${convertToSeconds(this.start)}-${convertToSeconds(this.end)}'`,
      '--force-keyframes-at-cuts',
      this.url,
      '-o',
      `${join('videos', this.output)}`,
    ];
  }
}

export default ClipCreatedEvent;

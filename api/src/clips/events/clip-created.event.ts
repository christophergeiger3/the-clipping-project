import { Clip } from '../schema/clip.schema';
import { Injectable } from '@nestjs/common';
import { ChildProcess } from 'child_process';
import { ObjectId } from 'mongoose';

@Injectable()
class ClipCreatedEvent extends Clip {
  _id: ObjectId;
  child: ChildProcess;
  args: string[];
  /** The FPS of the full clip */
  overallFPS?: number;
  /** Integer (0 - 100) of how much of the clip has been processed in ffmpeg */
  percentDone: number;
  /** The current frame being processed */
  currentFrameNumber: number;

  constructor(clip: Clip) {
    super(clip);
    // this.customFFMPEGCommand = clip.customFFMPEGCommand;
    this.percentDone = 0;
    this.currentFrameNumber = 0;
    this.args = [
      '-nostats',
      '-y',
      '-ss',
      `${this.start}ms`,
      '-to',
      `${this.end}ms`,
      '-i',
      `${this.analyzedUrl}`,
      '-hide_banner',
      '-loglevel',
      'info',
      '-progress',
      'pipe:3',
      `${this.output}`, // TODO: Output path may need to be tweaked
    ];
  }
}

export default ClipCreatedEvent;

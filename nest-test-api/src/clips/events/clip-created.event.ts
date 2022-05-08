import { Injectable } from '@nestjs/common';
import { ChildProcess } from 'child_process';
import { Clip } from '../schema/clip.schema';

@Injectable()
class ClipCreatedEvent extends Clip {
  child: ChildProcess;
  args: string[];
  /** The FPS of the full clip */
  overallFPS?: number;
  /** Integer (0 - 100) of how much of the clip has been processed in ffmpeg */
  percentDone: number;
  /** The current frame being processed */
  currentFrameNumber: number;
  constructor(clip: Clip) {
    super();
    Object.assign(this, clip);
    this.percentDone = 0;
    this.currentFrameNumber = 0;
    this.args = [];
    // this.child = null;
  }
}

export default ClipCreatedEvent;

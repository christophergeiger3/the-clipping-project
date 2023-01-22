import { Clip } from '../schema/clip.schema';
import { Injectable } from '@nestjs/common';
import { ChildProcess } from 'child_process';
import { ObjectId } from 'mongoose';
import { join } from 'path';
import convertToSeconds from '../utils/convertToSeconds';

const CLIP_DESTINATION = 'videos';

@Injectable()
class ClipCreatedEvent extends Clip {
  _id: ObjectId;
  child: ChildProcess;
  args: string[];
  /** The current frame being processed by ffmpeg, used to estimate ffmpeg progress */
  currentFrame: number;
  /** FPS of the downloaded clip, used to estimate ffmpeg progress */
  fps: number;
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
      `*${convertToSeconds(this.start)}-${convertToSeconds(this.end)}`,
      '--force-keyframes-at-cuts',
      '--downloader-args',
      'ffmpeg:-progress pipe:1', // pipe ffmpeg's progress to stdout (file descriptor 1)
      this.url,
      '-o',
      `${join(CLIP_DESTINATION, `${clip.name}.%(ext)s`)}`,
    ];
  }
}

export default ClipCreatedEvent;

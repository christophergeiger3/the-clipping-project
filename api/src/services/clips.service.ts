import { CreateClipDto } from '@/dtos/clip.dto';
import { Clip as ClipResponse } from '@/interfaces/clips.interface';
import clipModel from '@/models/clips.model';
import { logger } from '@/utils/logger';
import { ChildProcess, spawn } from 'child_process';
import { EventEmitter } from 'events';

enum Status {
  Done = 'done',
  Error = 'error',
  Idle = 'idle',
  Processing = 'processing',
}

interface Clip extends ClipResponse {
  child: ChildProcess;
  args: string[];
  /** The FPS of the full clip */
  overallFPS?: number;
  /** Integer (0 - 100) of how much of the clip has been processed in ffmpeg */
  percentDone: number;
  /** The current frame being processed */
  currentFrameNumber: number;
}

class Clip extends EventEmitter {
  constructor(clip: CreateClipDto) {
    super();
    Object.assign(this, clip);
    this.status = Status.Idle;
    this.args = [
      '-nostats',
      '-y',
      '-ss',
      `${this.start}ms`,
      '-to',
      `${this.end}ms`,
      '-i',
      `${this.url}`,
      '-hide_banner',
      '-loglevel',
      'info',
      '-progress',
      'pipe:3',
      `${this.output}`, // TODO: Output path may need to be tweaked
    ];
    this.percentDone = 0;
    this.currentFrameNumber = 0;
    logger.info(`ffmpeg ${this.args.join(' ')}`);
  }

  public async addToDb() {
    const { _id } = await clipModel.create({
      url: this.url,
      start: this.start,
      end: this.end,
      output: this.output,
      status: this.status,
    });

    this._id = _id;
  }

  public async process() {
    this.status = Status.Processing;
    this.child = spawn('ffmpeg', this.args, { stdio: ['ignore', 'pipe', 'pipe', 'pipe'] });

    this.child.stdio[3]?.on('data', data => {
      // includes various progress related info -- we only care about frame number (frame=)
      // later we can parse other stats for time running, etc.
      const progressStats = data.toString() as string;
      const frameNumber = progressStats.match(/frame=\s*(\d+)/);
      if (frameNumber) {
        const frame = parseInt(frameNumber[1]);
        const totalNumFrames = ((this.end - this.start) / 1000) * this.overallFPS;

        this.currentFrameNumber = frame;
        this.percentDone = Math.round((frame / totalNumFrames) * 100);
        this.emit('progress', { frame });
        logger.info(`frame: ${frame}, ${Math.round((frame / totalNumFrames) * 100)}%`);
      }
    });

    this.child.stdio[2]?.on('data', raw => {
      const data = raw.toString() as string;
      const fps = data.match(/(\d+) fps/);

      if (fps && !this.overallFPS) {
        this.overallFPS = parseInt(fps[1]);
        logger.info(`fps: ${this.overallFPS}`);
      }

      this.emit('data', data);
    });

    this.child.on('exit', async code => {
      if (code === 0) {
        this.status = Status.Done;
        this.emit('done');
        logger.info(`done: ${this.output}`);
      } else {
        this.status = Status.Error;
        this.emit('error');
        logger.error(`exit, error: ${this.output}`);
      }
      await clipModel.updateOne({ _id: this._id }, { status: this.status });
      this.emit('exit');
    });
  }
}

class ClipService {
  activeClips: Clip[] = [];

  public async createClip(clipData: CreateClipDto): Promise<ClipResponse> {
    const clip = new Clip({
      ...clipData,
      output: `clips/${clipData.output}`,
    });

    await clip.addToDb();
    clip.process();
    logger.info(`adding clip ${clip._id} to active clips`);
    this.activeClips.push(clip);

    clip.on('exit', () => {
      logger.info(`removing clip ${clip._id} from active clips`);
      this.activeClips = this.activeClips.filter(c => c._id !== clip._id);
    });

    const { _id, url, start, end, output, status } = clip;
    return { _id, url, start, end, output, status };
  }

  public async getClip(id: string): Promise<ClipResponse> {
    const clip = await clipModel.findById(id);
    return clip;
  }

  public async getClipProgress(id: string): Promise<Number | null> {
    const activeClip = this.activeClips.find(c => c._id == id);

    return activeClip?.percentDone ?? null;
  }
}

export default ClipService;

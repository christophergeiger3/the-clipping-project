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
}

class Clip extends EventEmitter {
  constructor(clip: CreateClipDto) {
    super();
    Object.assign(this, clip);
    this.status = Status.Idle;
    this.addToDb();
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
      `${this.output}`,
    ];
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
      // const progress = parseProgress(data.toString());
      this.emit('progress', data.toString());
      logger.info(`progress: ${data.toString()}`);
    });

    this.child.stdio[2]?.on('data', raw => {
      this.emit('data', raw.toString());
      logger.info(`data: ${raw.toString()}`);
    });

    this.child.on('exit', async code => {
      if (code === 0) {
        this.status = Status.Done;
        this.emit('done');
      } else {
        this.status = Status.Error;
        this.emit('error');
      }
      await clipModel.updateOne({ _id: this._id }, { status: this.status });
    });
  }
}

class ClipService {
  public async createClip(clipData: CreateClipDto): Promise<ClipResponse> {
    const clip = new Clip(clipData);
    clip.process();
    const { _id, url, start, end, output, status } = clip;
    return { _id, url, start, end, output, status };
  }
}

export default ClipService;

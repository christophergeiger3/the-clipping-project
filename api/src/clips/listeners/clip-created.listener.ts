import { Injectable, Logger } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { spawn } from 'child_process';
import { ClipsService } from '../clips.service';
import ClipCreatedEvent from '../events/clip-created.event';

enum Status {
  Done = 'done',
  Error = 'error',
  Idle = 'idle',
  Processing = 'processing',
}

@Injectable()
class ClipCreatedListener {
  constructor(
    private readonly clipsService: ClipsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('clip.created')
  handleClipCreatedEvent(clip: ClipCreatedEvent) {
    Logger.log('clipCreated event received');
    this.clipsService.activeClips.push(clip);
    this.process(clip);
    this.clipsService.activeClips.splice(
      this.clipsService.activeClips.indexOf(clip),
      1,
    );
  }

  /** FFMPEG processing pipeline */
  async process(clip: ClipCreatedEvent) {
    Logger.log('Processing clip');
    clip.status = Status.Processing;
    clip.child = spawn('ffmpeg', clip.args, {
      stdio: ['ignore', 'pipe', 'pipe', 'pipe'],
    });
    Logger.log('Spawned child process');

    clip.child.stdio[3]?.on('data', (data) => {
      // includes various progress related info -- we only care about frame number (frame=)
      // later we can parse other stats for time running, etc.
      const progressStats = data.toString() as string;
      const frameNumber = progressStats.match(/frame=\s*(\d+)/);
      if (frameNumber) {
        const frame = parseInt(frameNumber[1]);
        const totalNumFrames =
          ((clip.end - clip.start) / 1000) * clip.overallFPS;

        clip.currentFrameNumber = frame;
        clip.percentDone = Math.round((frame / totalNumFrames) * 100);
        this.eventEmitter.emit('clip.progress', { frame });
        Logger.log(
          `id: ${clip._id}, frame: ${frame}, ${Math.round(
            (frame / totalNumFrames) * 100,
          )}%`,
        );
      }
    });

    clip.child.stdio[2]?.on('data', (raw) => {
      const data = raw.toString() as string;
      const fps = data.match(/(\d+) fps/);

      if (fps && !clip.overallFPS) {
        clip.overallFPS = parseInt(fps[1]);
        Logger.log(`fps: ${clip.overallFPS}`);
      }

      this.eventEmitter.emit('clip.data', { data });
    });

    clip.child.on('exit', async (code) => {
      if (code === 0) {
        clip.status = Status.Done;
        this.eventEmitter.emit('clip.done', { clip });
        Logger.log(`done: ${clip.output}`);
      } else {
        clip.status = Status.Error;
        this.eventEmitter.emit('clip.error', { clip });
        Logger.error(`exit, error: ${clip.output}`);
      }
      await this.clipsService.update(clip._id, { status: clip.status });
      this.eventEmitter.emit('clip.exit', { clip });
    });
  }
}

export default ClipCreatedListener;

import { Injectable, Logger } from '@nestjs/common';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';
import { spawn } from 'child_process';
import { ClipsService } from '../clips.service';
import ClipCreatedEvent from '../events/clip-created.event';
import { Status } from '../schema/clip.schema';

@Injectable()
class ClipCreatedListener {
  constructor(
    private readonly clipsService: ClipsService,
    private eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('clip.created')
  handleClipCreatedEvent(clip: ClipCreatedEvent) {
    // Add clip to active clips array, to be removed when clip.child 'exit' event is emitted
    this.clipsService.setActive(clip);
    this.process(clip);
  }

  /** Clip processing pipeline */
  async process(clip: ClipCreatedEvent) {
    const parseClipFPS = (data: string) => {
      const fpsRegex = /(\d+) fps/;
      const fps = data.match(fpsRegex)?.[1] || null;

      if (fps === null) {
        return;
      }

      if (clip.fps === undefined) {
        clip.fps = parseInt(fps);
        Logger.log(`fps: ${clip.fps}`);
      }
    };

    const parseDestinationFromString = (data: string) => {
      const destinationRegex = /^\[download\] Destination: \S*\/(\S*)\s*$/;
      const filename = data.match(destinationRegex)?.[1] || null;

      if (filename === null) {
        return;
      }

      clip.filename = filename;
      this.clipsService.update(clip._id, { filename });
      Logger.log(`id: ${clip._id}, ${filename}`);
    };

    /** Updates clip.percentDone, which is calculated as the number of frames processed over the total number of frames */
    const updateClipProgress = (clip: ClipCreatedEvent) => {
      const totalFrames = ((clip.end - clip.start) / 1000) * clip.fps;
      clip.percentDone = Math.round((clip.currentFrame / totalFrames) * 100);

      this.eventEmitter.emit('clip.progress', clip);

      Logger.log(
        `id: ${clip._id}, frame: ${clip.currentFrame}, ${clip.percentDone}%`,
      );
    };

    const parseFFmpegProgress = (data: string) => {
      // includes various progress related info spawned by ffmpeg's -progres flag
      // right now we only care about frame number (frame=)
      // later we can parse other stats for time running, etc.
      const frameRegex = /frame=\s*(\d+)/;
      const currentFrame = data.match(frameRegex)?.[1] || null;

      if (currentFrame === null) {
        return;
      }

      clip.currentFrame = parseInt(currentFrame, 10);
      updateClipProgress(clip);
    };

    const onExit = async (code: number) => {
      Logger.log(`id: ${clip._id}, exited with code ${code}`);

      if (code === 0) {
        clip.status = Status.Done;
        this.eventEmitter.emit('clip.done', { clip });
        Logger.log(`done: ${clip.filename}`);
      } else {
        clip.status = Status.Error;
        this.eventEmitter.emit('clip.error', { clip });
        Logger.error(`error: ${clip.filename}`);
      }

      this.clipsService.setInactive(clip._id, clip.status);
      this.eventEmitter.emit('clip.exit', { clip });
    };

    Logger.log(`Processing clip ${clip._id}`);
    Logger.log(`yt-dlp ${clip.args.join(' ')}`);

    clip.child = spawn('yt-dlp', clip.args);
    Logger.log(`Spawned child process for ${clip.url}`);

    // FFmpeg outputs fps and other info to file descriptor 3, aka stderr
    clip.child.stderr?.setEncoding('utf8');
    clip.child.stderr?.on('data', parseClipFPS);

    clip.child.stdout?.setEncoding('utf8');
    clip.child.stdout?.on('data', parseDestinationFromString);
    clip.child.stdout?.on('data', parseFFmpegProgress);

    clip.child.on('exit', onExit);
  }
}

export default ClipCreatedListener;

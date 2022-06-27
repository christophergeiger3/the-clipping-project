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
    const parseDestinationFromString = (data: string) => {
      const destinationRegex = /^\[download\] Destination: (\S*)\s*$/;
      const filename = data.match(destinationRegex)?.[1] || null;
      if (filename !== null) {
        clip.filename = filename;
        Logger.log(`id: ${clip._id}, ${filename}`);
      }
    };

    const parseProgressFromString = (data: string) => {
      const percentRegex = /(\d+.?\d+)%/;
      const percentDone = data.match(percentRegex)?.[1] || null;

      if (percentDone !== null) {
        clip.percentDone = parseInt(percentDone, 10); // Note: parseInt drops decimals here
        Logger.log(`id: ${clip._id}, ${clip.percentDone}%`);
      }
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

    clip.child.stdout.setEncoding('utf8');
    clip.child.stdout.on('data', parseDestinationFromString);
    clip.child.stdout.on('data', parseProgressFromString);

    clip.child.on('exit', onExit);
  }
}

export default ClipCreatedListener;

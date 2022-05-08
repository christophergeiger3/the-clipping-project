import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import ClipCreatedEvent from '../events/clip-created.event';

@Injectable()
class ClipCreatedListener {
  @OnEvent('clip.created')
  handleClipCreatedEvent(clip: ClipCreatedEvent) {
    Logger.log('clipCreated event received', JSON.stringify(clip, null, 2));
  }
}

export default ClipCreatedListener;

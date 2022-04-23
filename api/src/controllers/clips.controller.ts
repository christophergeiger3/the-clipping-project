import { CreateClipDto } from '@/dtos/clip.dto';
import { Clip as ClipResponse } from '@/interfaces/clips.interface';
import ClipService from '@/services/clips.service';
import { logger } from '@/utils/logger';
import { NextFunction, Request, Response } from 'express';

class ClipsController {
  public clipService = new ClipService();

  public createClip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clip: CreateClipDto = req.body;
      const createClipData: ClipResponse = await this.clipService.createClip(clip);
      res.status(202).json({ data: createClipData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public getClip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const clip = await this.clipService.getClip(id);
      res.status(200).json({ data: clip, message: 'success' });
    } catch (error) {
      next(error);
    }
  };

  public getClipProgress = async (req: Request, res: Response, next: NextFunction) => {
    // https://dev.to/hritique/send-realtime-data-streams-without-using-socket-io-32l6
    // Realtime stream via EventSource API
    const sleepAndGetClipProgress = async (ms: number, id: string) => {
      return new Promise(resolve =>
        setTimeout(async () => {
          resolve(await this.clipService.getClipProgress(id));
        }, ms),
      );
    };
    try {
      const { id } = req.params;
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.flushHeaders(); // flush headers to send them right away

      let progress = await sleepAndGetClipProgress(2000, id);
      while (progress && progress < 100) {
        logger.info(`data: ${progress}`);
        res.write('event: message\n');
        res.write(`data: ${JSON.stringify(progress)}`);
        res.write('\n\n');
        res.flush(); // flush to send the data right away
        progress = await sleepAndGetClipProgress(2000, id);
      }
      // res.write(`data: end\n\n`);
      // res.status(200).json({ data: progress, message: 'success' });
      res.end();
    } catch (error) {
      next(error);
    }
  };
}

export default ClipsController;

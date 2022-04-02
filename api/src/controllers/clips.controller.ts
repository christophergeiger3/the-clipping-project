import { CreateClipDto } from '@/dtos/clip.dto';
import { Clip as ClipResponse } from '@/interfaces/clips.interface';
import ClipService from '@/services/clips.service';
import { NextFunction, Request, Response } from 'express';

class ClipsController {
  public clipService = new ClipService();

  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clip: CreateClipDto = req.body;
      const createClipData: ClipResponse = await this.clipService.createClip(clip);
      res.status(201).json({ data: createClipData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}

export default ClipsController;

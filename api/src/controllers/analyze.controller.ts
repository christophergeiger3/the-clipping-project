import { URLDto } from '@/dtos/url.dto';
import { URLResponse } from '@/interfaces/analyze.interface';
import AnalyzeService from '@/services/analyze.service';
import { NextFunction, Request, Response } from 'express';

class AnalyzeController {
  public analyzeService = new AnalyzeService();

  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { url }: URLDto = req.body;
      const analyzedURLData: URLResponse = await this.analyzeService.analyzeURL(url);
      res.status(201).json({ data: analyzedURLData, message: 'done' });
    } catch (error) {
      next(error);
    }
  };
}

export default AnalyzeController;

import { URLDto } from './../dtos/url.dto';
import { Routes } from '@/interfaces/routes.interface';
import validationMiddleware from '@/middlewares/validation.middleware';
import { Router } from 'express';
import AnalyzeController from '@/controllers/analyze.controller';

class AnalyzeRoute implements Routes {
  public path = '/analyze';
  public router = Router();
  public analyzeController = new AnalyzeController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validationMiddleware(URLDto, 'body'), this.analyzeController.index);
  }
}

export default AnalyzeRoute;

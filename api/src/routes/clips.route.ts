import express, { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import ClipsController from '@/controllers/clips.controller';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateClipDto } from '@/dtos/clip.dto';

class ClipsRoute implements Routes {
  public path = '/clips';
  public router = Router();
  public clipsController = new ClipsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, validationMiddleware(CreateClipDto, 'body'), this.clipsController.index);
    this.router.get(`${this.path}/:id`, this.clipsController.getClip);
    this.router.get(`${this.path}/:id/status`, this.clipsController.getClipPercent);
    this.router.use(`${this.path}/videos`, express.static('clips'));
  }
}

export default ClipsRoute;

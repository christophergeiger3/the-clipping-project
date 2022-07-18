import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getStatus(): Promise<string> {
    return this.appService.getStatus();
  }

  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req: RequestType) {
    return req.user;
  }
}

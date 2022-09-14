import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as RequestType } from 'express';
import { LocalAuthGuard } from './local-auth.guard';

@Controller()
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req: RequestType) {
    return req.user;
  }
}

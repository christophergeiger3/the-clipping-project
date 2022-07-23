import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as RequestType } from 'express';

@Controller()
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Request() req: RequestType) {
    return req.user;
  }
}

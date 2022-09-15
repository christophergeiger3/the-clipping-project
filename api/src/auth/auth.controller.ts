import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as RequestType } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schema/user.schema';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: RequestType & { user: User }) {
    return this.authService.login(req.user);
  }

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getStatus(@Request() req: RequestType & { user: User }) {
    return { username: req.user.username };
  }
}

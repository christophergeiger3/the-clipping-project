import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Request as RequestType } from 'express';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/users/schema/user.schema';
import { AuthService, TokenResponse } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: CreateUserDto })
  @ApiOkResponse({ type: TokenResponse })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: RequestType & { user: User }) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Register' })
  @ApiBody({ type: CreateUserDto })
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Get user details from JWT' })
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getStatus(@Request() req: RequestType & { user: User }) {
    return { username: req.user.username };
  }
}

import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtPayload } from './jwt.strategy';
import { ApiProperty } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { JWT_TOKEN_EXPIRATION } from 'src/env.default';

// https://docs.oracle.com/en/cloud/saas/live-experience/faled/the-jwt-access-token.html#u30011457
export class TokenResponse {
  @ApiProperty()
  access_token: string;

  @ApiProperty({ description: 'Seconds until token expires' })
  expires_in: number;

  @ApiProperty()
  token_type: 'Bearer';
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /** @returns The user if the username and password are valid, otherwise null */
  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) {
      return null;
    }

    return (await compare(password, user.password)) ? user : null;
  }

  async register(createUserDto: CreateUserDto) {
    const { username } = createUserDto;

    // Verify this username is not already taken
    if (await this.usersService.findOneByUsername(username)) {
      throw new HttpException(`Username already exists`, 409);
    }

    const newUser = await this.usersService.create(createUserDto);
    return this.createToken(newUser);
  }

  async login(user: User) {
    return this.createToken(user);
  }

  /** @returns Creates the JWT payload that's stored by the user.
   * Later the payload will be unsigned during client requests
   * after the user is verified by the JWT strategy.
   */
  createJwtPayload(user: User): JwtPayload {
    return { username: user.username, sub: user._id };
  }

  /** @returns the signed JWT token for the user */
  async createToken(user: User): Promise<TokenResponse> {
    const token_type = 'Bearer';

    // Get the expiration time from .env
    const expires_in = this.configService.get(
      'JWT_TOKEN_EXPIRATION',
      JWT_TOKEN_EXPIRATION,
    );

    const payload = this.createJwtPayload(user);

    return {
      access_token: this.jwtService.sign(payload),
      expires_in,
      token_type,
    };
  }
}

import { OWNER_USERNAME, OWNER_PASSWORD } from './../env.default';
import { HttpException, Injectable, OnModuleInit } from '@nestjs/common';
import { User, UserRole } from 'src/users/schema/user.schema';
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
export class AuthService implements OnModuleInit {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /** Handle first time admin registration */
  async onModuleInit() {
    await this.registerOwner();
  }

  /** Register the owner using the data stored in the .env config, and delete any predecessors */
  async registerOwner() {
    const username = this.configService.get('OWNER_USERNAME', OWNER_USERNAME);
    const password = this.configService.get('OWNER_PASSWORD', OWNER_PASSWORD);
    const role = UserRole.owner;

    // side effect: there may only be one owner at any time, so delete all previous owners
    await this.usersService.deleteManyByRole(role);

    // side effect: the owner gets dibs on a username of their choice,
    // delete any previous users who dared to take it
    await this.usersService.deleteManyByUsername(username);

    return this.register({ username, password, role });
  }

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

    // console.log('Creating user', createUserDto);
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

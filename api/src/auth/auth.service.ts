import { HttpException, Injectable } from '@nestjs/common';
import { User } from 'src/users/schema/user.schema';
import { UsersService } from 'src/users/users.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  /** @returns the signed JWT token for the user */
  async createToken(user: User) {
    const payload: JwtPayload = { username: user.username, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

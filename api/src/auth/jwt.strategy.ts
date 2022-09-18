import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JWT_SECRET } from './constants';
import { ObjectId } from 'mongoose';
import { UsersService } from 'src/users/users.service';

/** Payload that is signed server-side then stored by the user */
export type JwtPayload = {
  username: string;
  sub: ObjectId;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  /** If this function is reached, the JWT token is already valid */
  async validate(payload: JwtPayload) {
    const { sub: userId } = payload;

    // Any access gating (e.g. revoking tokens / banning users) should be done here

    return this.userService.findOne(userId);
  }
}

import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Fires the local passport strategy, which triggers the validateUser auth service */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

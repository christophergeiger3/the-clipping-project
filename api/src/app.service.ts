import { Injectable } from '@nestjs/common';
import { exec as callbackExec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(callbackExec);

@Injectable()
export class AppService {
  async getStatus(): Promise<string> {
    await exec('yt-dlp --version');
    return 'The clips API is up and running!';
  }
}

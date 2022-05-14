import { Injectable } from '@nestjs/common';
import { exec as callbackExec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(callbackExec);

@Injectable()
export class AnalyzeService {
  /** Analyze a URL with youtube-dl (runs `youtube-dl -f best --get-url '${url}'` under the hood)
   *  @returns an array of URLs, since in some cases youtube-dl returns multiple
   *  separate URLs for the same video (e.g. separate audio and video tracks)
   */
  async analyze(url: string): Promise<string[]> {
    const { stdout, stderr } = await exec(
      `youtube-dl -f best --get-url '${url}'`,
    );

    // TODO: handle error
    if (stderr) {
      throw new Error(stderr);
    }

    return stdout.split(/\r?\n/);
  }
}

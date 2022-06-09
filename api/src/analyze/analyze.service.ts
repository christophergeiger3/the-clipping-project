import { HttpException, Injectable } from '@nestjs/common';
import { exec as callbackExec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(callbackExec);

enum QualityTypes {
  best = 'best',
  worst = 'worst',
}

type Quality = QualityTypes;

@Injectable()
export class AnalyzeService {
  /** Analyze a URL with youtube-dl (runs `youtube-dl -f best --get-url '${url}'` under the hood)
   *  @returns an array of URLs, since in some cases youtube-dl returns multiple
   *  separate URLs for the same video (e.g. separate audio and video tracks)
   */
  async analyze(
    url: string,
    quality: Quality = QualityTypes.best,
  ): Promise<string[]> {
    let stdout: string;

    try {
      const result = await exec(`yt-dlp -f ${quality} --get-url '${url}'`);
      stdout = result.stdout;
    } catch (err) {
      if (err.message.includes('HTTP Error 404')) {
        throw new HttpException(
          'The requested URL was not found. If you entered the URL manually please check your spelling and try again.',
          404,
        );
      } else {
        throw new HttpException(err.message, 500);
      }
    }

    return stdout.split(/\r?\n/);
  }
}

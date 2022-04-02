import { URLResponse } from '@/interfaces/analyze.interface';
import { ChildProcess, exec as callbackExec } from 'child_process';
import { promisify } from 'util';

const exec = promisify(callbackExec);

class AnalyzeService {
  public child: ChildProcess;
  public analyzeURL = async (url: string): Promise<URLResponse> => {
    const { stdout, stderr } = await exec(`youtube-dl -f best --get-url '${url}'`);
    console.log(stdout);

    // TODO: handle error
    if (stderr) {
      throw new Error(stderr);
    }

    return {
      urls: stdout.split(/\r?\n/),
    };
  };
}

export default AnalyzeService;

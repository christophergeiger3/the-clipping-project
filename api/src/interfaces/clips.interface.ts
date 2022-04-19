export interface Clip {
  _id: string;
  url: string;
  start: number;
  end: number;
  output: string;
  status: string;
  customFFMPEGCommand?: string | undefined;
}

/** Return filename without extension (not to be confused with GNU's basename)
 * @example basename('file.ext') // returns 'file'
 */
export default function basename(filename: string): string {
  return filename.split('.').slice(0, -1).join('.');
}

/** @example parseExtension('video.webm')  // returns 'webm' */
export function parseExtension(filename: string): string {
  return filename.split('.').pop() || '';
}

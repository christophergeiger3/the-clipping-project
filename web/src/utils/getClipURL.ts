import { Clip } from "@/api";
import { API_URL } from "@/env";

export default function getClipURL(clip: Clip) {
  return `${API_URL}/${clip.filename}`;
}

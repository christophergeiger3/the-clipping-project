import { useEffect, useState } from "react";

interface ProgressResponse {
  progress: number;
}

export function useEventSource(url: string) {
  const [data, updateData] = useState<number | null>();

  useEffect(() => {
    const source = new EventSource(url);

    source.onmessage = ({ data }: MessageEvent<string>) => {
      const { progress } = JSON.parse(data) as ProgressResponse;
      updateData(progress);
      if (progress === 100 || progress === -1) {
        source.close();
      }
    };
  }, [url]);

  return data;
}

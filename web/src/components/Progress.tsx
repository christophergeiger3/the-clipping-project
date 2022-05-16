import { LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface ProgressResponse {
  progress: number;
}

const useEventSource = (url: string) => {
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
};

export function ClipProgressBar({ id }: { id: string }) {
  const progress = useEventSource(`http://localhost:3000/clips/${id}/progress`);

  if (!progress) {
    return null;
  }

  if (progress === -1) {
    // Return loading bar (clip is not active)
    return <LinearProgress />;
  }

  return (
    <>
      <LinearProgress variant="determinate" value={progress} />
      <Typography variant="h6">{progress}%</Typography>
    </>
  );
}

export default function Progress() {
  const { id } = useParams<{ id: string }>();

  return id ? <ClipProgressBar id={id} /> : null;
}

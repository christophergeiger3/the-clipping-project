import { LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const useEventSource = (url: string) => {
  const [data, updateData] = useState<number | null>();

  useEffect(() => {
    const source = new EventSource(url);

    source.onmessage = function logEvents(event) {
      updateData(JSON.parse(event.data));
    };
  }, [url]);

  return data;
};

export default function Progress() {
  const { id } = useParams<{ id: string }>();
  const data = useEventSource(`http://localhost:3000/clips/progress/${id}`);

  // Null response from event source means the clip is not processing
  if (data === null) {
    return <Typography>Done.</Typography>;
  }

  if (data === undefined) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <LinearProgress variant="determinate" value={data} />
      <Typography variant="h6">{data}%</Typography>
    </>
  );
}

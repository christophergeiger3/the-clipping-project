import { CircularProgress, Typography } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import ClipCard from "./ClipCard";

export type Clip = {
  _id: string;
  url: string;
  start: number;
  end: number;
  output: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function Clips() {
  const [clips, setClips] = useState<Clip[]>();

  useEffect(() => {
    async function getClips(): Promise<void> {
      const clips = (await axios.get("http://localhost:3000/clips"))
        .data as Clip[];
      setClips(clips);
    }
    const timer = setInterval(getClips, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleClipDelete = useCallback(
    (id: string) => {
      setClips(clips?.filter((clip) => clip._id !== id));
    },
    [clips]
  );

  if (!clips) {
    return <CircularProgress />;
  }

  // TODO: update clips array somehow when a new clip has been created
  return clips.length ? (
    <>
      {clips.map((clip) => (
        <ClipCard key={clip._id} clip={clip} onDelete={handleClipDelete} />
      ))}
    </>
  ) : (
    <Typography variant="h5">No clips found.</Typography>
  );
}

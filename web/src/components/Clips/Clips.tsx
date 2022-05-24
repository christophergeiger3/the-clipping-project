import { CircularProgress, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Components } from "../../client";
import { useClient } from "../../providers/ApiProvider";
import ClipCard from "./ClipCard";

type Clip = Components.Schemas.ClipWithId;

export default function Clips() {
  const { client } = useClient();
  const [clips, setClips] = useState<Clip[]>();

  useEffect(() => {
    async function getClips(): Promise<void> {
      const request = await client;
      const clips = (await request.ClipsController_findAll()).data as Clip[];
      setClips(clips);
    }
    getClips();
    const timer = setInterval(getClips, 5000);
    return () => clearInterval(timer);
  }, [client]);

  const handleClipDelete = useCallback(
    (id: string) => {
      setClips(clips?.filter((clip) => clip._id !== id));
    },
    [clips]
  );

  if (!clips) {
    return <CircularProgress />;
  }

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

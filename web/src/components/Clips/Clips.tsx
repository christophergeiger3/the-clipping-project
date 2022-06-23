import { CircularProgress, Typography } from "@mui/material";
import { useClipsControllerFindAll } from "../../api";
import { useCallback } from "react";
import ClipCard from "./ClipCard";

/** @constant milliseconds */
const FIND_ALL_CLIPS_REFETCH_INTERVAL = 5000;

export default function Clips() {
  const { data: clipsResponse, refetch } = useClipsControllerFindAll({
    query: {
      refetchInterval: FIND_ALL_CLIPS_REFETCH_INTERVAL,
    },
  });
  const clips = clipsResponse?.data;

  const handleClipDelete = useCallback(
    (_id: string) => {
      refetch();
    },
    [refetch]
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

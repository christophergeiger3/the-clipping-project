import { CircularProgress, Typography } from "@mui/material";
import { useClipsControllerFindAll } from "../../api";
import ClipCard from "./ClipCard";

/** @constant milliseconds */
const FIND_ALL_CLIPS_REFETCH_INTERVAL = 5000;

export default function Clips() {
  const { data: clipsResponse, refetch } = useClipsControllerFindAll({
    query: {
      refetchInterval: FIND_ALL_CLIPS_REFETCH_INTERVAL,
    },
  });

  if (!clipsResponse?.data) {
    return <CircularProgress />;
  }

  return clipsResponse.data.length ? (
    <>
      {clipsResponse.data.map((clip) => (
        <ClipCard key={clip._id} clip={clip} onDelete={refetch} />
      ))}
    </>
  ) : (
    <Typography variant="h5">No clips found.</Typography>
  );
}

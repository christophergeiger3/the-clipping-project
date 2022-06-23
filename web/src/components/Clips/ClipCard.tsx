import { LoadingButton } from "@mui/lab";
import { CardActions, Link } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";
import { ClipProgressBar } from "../Progress";
import { convertMillisecondsToTimestamp } from "../../utils/timestamp";
import { Clip, useClipsControllerRemove } from "../../api";

// MUI Card displaying clip id, url, start, end, output, status, createdAt, updatedAt
export default function ClipCard({
  clip,
  onDelete,
}: {
  clip: Clip;
  onDelete?: (id: string) => void;
}) {
  const { mutate: removeClipById, isLoading: isRemoving } =
    useClipsControllerRemove();

  const removeClip = useCallback(() => {
    const id = clip._id;
    removeClipById({ id });
    onDelete?.(id);
  }, [clip._id, removeClipById, onDelete]);

  const clipLink = `${process.env.REACT_APP_API_URL}/${clip.output
    .split("/")
    .pop()}`;

  return (
    <Card variant="outlined">
      <CardContent>
        <Link href={clipLink}>
          <Typography variant="h5">{clip.output}</Typography>
        </Link>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {clip.url}
        </Typography>
        <Typography color="text.secondary">
          {convertMillisecondsToTimestamp(clip.start)} -{" "}
          {convertMillisecondsToTimestamp(clip.end)}
        </Typography>
        <Typography color="text.secondary">{clip.status}</Typography>
        {/* Temporary, for debugging: */}
        <Typography>{clip._id}</Typography>
        {clip.status === "processing" ? (
          <ClipProgressBar id={clip._id} />
        ) : null}
      </CardContent>
      <CardActions>
        <LoadingButton
          variant="outlined"
          color="secondary"
          loading={isRemoving}
          onClick={removeClip}
        >
          Delete
        </LoadingButton>
      </CardActions>
    </Card>
  );
}

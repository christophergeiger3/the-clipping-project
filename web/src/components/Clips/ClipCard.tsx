import { LoadingButton } from "@mui/lab";
import { CardActions, Link } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";
import { ClipProgressBar } from "../Progress";
import { convertMillisecondsToTimestamp } from "../../utils/timestamp";
import { Clip, useClipsControllerRemove } from "../../api";
import { Check, Error, HourglassEmpty } from "@mui/icons-material";

const SpinningHourglass = () => (
  <HourglassEmpty
    color="warning"
    sx={{
      animation: "spin 2s linear infinite",
      "@keyframes spin": {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    }}
  />
);

// MUI Card displaying clip attributes
export default function ClipCard({
  clip,
  onDelete,
}: {
  clip: Clip;
  onDelete?: () => void;
}) {
  const { mutate: removeClipById, isLoading: isRemoving } =
    useClipsControllerRemove();

  const removeClip = useCallback(() => {
    removeClipById({ id: clip._id }, { onSuccess: onDelete });
  }, [removeClipById, clip._id, onDelete]);

  const clipLink = clip.filename
    ? `${process.env.REACT_APP_API_URL}/${clip.filename}`
    : undefined;

  return (
    <Card variant="outlined">
      <CardContent>
        <Link href={clipLink}>
          <Typography variant="h5">{clip.name}</Typography>
        </Link>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {clip.url}
        </Typography>
        <Typography>
          {convertMillisecondsToTimestamp(clip.start)} -{" "}
          {convertMillisecondsToTimestamp(clip.end)}
        </Typography>
        {/* <Typography color="text.secondary">{clip.status}</Typography> */}
        {/* Temporary, for debugging: */}
        {/* <Typography>{clip._id}</Typography> */}
        {clip.status === "done" ? <Check color="success" /> : null}
        {clip.status === "processing" ? (
          <ClipProgressBar id={clip._id} />
        ) : null}
        {clip.status === "idle" ? <SpinningHourglass /> : null}
        {clip.status === "error" ? <Error color="error" /> : null}
      </CardContent>
      <CardActions>
        <LoadingButton
          variant="contained"
          color="warning"
          loading={isRemoving}
          onClick={removeClip}
        >
          Delete
        </LoadingButton>
      </CardActions>
    </Card>
  );
}

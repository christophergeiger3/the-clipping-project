import { LoadingButton } from "@mui/lab";
import { CardActions, Link } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useCallback } from "react";
import { ClipProgressBar } from "../Progress";
import { convertMillisecondsToTimestamp } from "../../utils/timestamp";
import { Clip, useClipsControllerRemove } from "../../api";
import { Check, Error, HourglassFullTwoTone } from "@mui/icons-material";

const SpinningHourglass = ({ ...props }) => (
  <HourglassFullTwoTone
    color="info"
    sx={{
      animation: "spin 2s linear infinite",
      "@keyframes spin": {
        from: { transform: "rotate(0deg)" },
        to: { transform: "rotate(360deg)" },
      },
    }}
    {...props}
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
    <Card variant="outlined" sx={{ marginTop: 1 }}>
      <CardContent>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ marginRight: "0.5rem" }}>
            {clip.status === "done" ? <Check color="success" /> : null}
            {clip.status === "processing" ? <SpinningHourglass /> : null}
            {clip.status === "idle" ? (
              <SpinningHourglass color="warning" />
            ) : null}
            {clip.status === "error" ? <Error color="error" /> : null}
          </div>

          <Link href={clipLink}>
            <Typography variant="h5">{clip.name}</Typography>
          </Link>
        </div>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {clip.url}
        </Typography>
        <Typography>
          {convertMillisecondsToTimestamp(clip.start)} -{" "}
          {convertMillisecondsToTimestamp(clip.end)}
        </Typography>
        {clip.status === "processing" ? (
          <ClipProgressBar id={clip._id} />
        ) : null}
      </CardContent>
      <CardActions>
        <LoadingButton
          variant="contained"
          color="error"
          loading={isRemoving}
          onClick={removeClip}
        >
          Delete
        </LoadingButton>
      </CardActions>
    </Card>
  );
}

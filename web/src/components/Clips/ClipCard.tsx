import { LoadingButton } from "@mui/lab";
import { CardActions, Link } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useCallback, useState } from "react";
import { ClipProgressBar } from "../Progress";
import { convertMillisecondsToTimestamp } from "../../utils/timestamp";
import { useClient } from "../../providers/ApiProvider";
import { Components } from "../../client";

type Clip = Components.Schemas.ClipWithId;

// MUI Card displaying clip id, url, start, end, output, status, createdAt, updatedAt
export default function ClipCard({
  clip,
  onDelete,
}: {
  clip: Clip;
  onDelete?: (id: string) => void;
}) {
  const { client } = useClient();
  const [isDeleting, setIsDeleting] = useState(false);
  // TODO: store link to clip in clip schema
  const clipLink = `http://localhost:3000/${clip.output.split("/").pop()}`;

  const deleteClip = useCallback(async () => {
    setIsDeleting(true);
    const request = await client;
    const response = await request.ClipsController_remove(clip._id);
    console.log(response.data);
    setIsDeleting(false);
    onDelete?.(clip._id);
  }, [client, clip._id, onDelete]);
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
          loading={isDeleting}
          onClick={deleteClip}
        >
          Delete
        </LoadingButton>
      </CardActions>
    </Card>
  );
}

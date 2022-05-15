import { LoadingButton } from "@mui/lab";
import { CardActions, Link } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { useCallback, useState } from "react";
import { ClipProgressBar } from "../Progress";
import { Clip } from "./Clips";

// MUI Card displaying clip id, url, start, end, output, status, createdAt, updatedAt
export default function ClipCard({
  clip,
  onDelete,
}: {
  clip: Clip;
  onDelete?: (id: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const clipLink = `/clips/${clip._id}`;

  const deleteClip = useCallback(async () => {
    setIsDeleting(true);
    const response = await axios.delete(
      `http://localhost:3000/clips/${clip._id}`
    );
    console.log(response.data);
    setIsDeleting(false);
    onDelete?.(clip._id);
  }, [clip._id, onDelete]);
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
          {clip.start} - {clip.end}
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

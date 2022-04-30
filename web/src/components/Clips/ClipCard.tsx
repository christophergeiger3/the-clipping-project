import { Link } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Clip } from "./Clips";

// MUI Card displaying clip id, url, start, end, output, status, createdAt, updatedAt
export default function ClipCard({ clip }: { clip: Clip }) {
  const clipLink = `/clips/${clip._id}`;
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
      </CardContent>
    </Card>
  );
}

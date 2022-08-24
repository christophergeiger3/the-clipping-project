import { Button } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function ViewAllClipsButton() {
  return (
    <Button startIcon={<OpenInNewIcon />} variant="contained" fullWidth={true}>
      View All Clips
    </Button>
  );
}

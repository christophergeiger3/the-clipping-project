import { Button, Grid } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

export default function ViewAllClipsButton() {
  return (
    <Grid item={true} mt={1}>
      <Button
        href="/clips"
        target="_blank"
        startIcon={<OpenInNewIcon />}
        variant="contained"
        fullWidth={true}
      >
        View All Clips
      </Button>
    </Grid>
  );
}

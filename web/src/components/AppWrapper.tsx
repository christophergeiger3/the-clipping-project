import { Grid, Typography } from "@mui/material";
import "./AppWrapper.css";

// TODO: need to make a Sidebar, and need to fix ClipView so that the video renders within the contianer
// resize video player: https://docs.videojs.com/tutorial-layout.html
function Sidebar() {
  return (
    <ul>
      <li>
        <Typography>item 1</Typography>
      </li>
      <li>
        <Typography>item 2</Typography>
      </li>
      <li>
        <Typography>item 3</Typography>
      </li>
    </ul>
  );
}

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Grid container={true} columnSpacing={2}>
      <Grid className="sidebar" item={true} xs={2}>
        <Sidebar />
      </Grid>
      <Grid item={true} xs={8}>
        {children}
      </Grid>
      <Grid item={true} xs={2} />
    </Grid>
  );
}
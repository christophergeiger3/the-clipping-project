import { Grid } from "@mui/material";
import "./AppWrapper.css";

// resize video player: https://docs.videojs.com/tutorial-layout.html
function Sidebar() {
  return <ul></ul>;
}

export default function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Grid container={true} columnSpacing={2}>
      <Grid className="sidebar" item={true} xs={1}>
        <Sidebar />
      </Grid>
      <Grid item={true} xs={10}>
        {children}
      </Grid>
      <Grid item={true} xs={1} />
    </Grid>
  );
}

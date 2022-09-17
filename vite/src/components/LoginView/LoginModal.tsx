import {
  Button,
  Grid,
  Modal,
  Card,
  Typography,
  Input,
  CardContent,
  CardActions,
} from "@mui/material";
import { useCallback, useState } from "react";

function useModal() {
  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  return { open, handleOpen, handleClose };
}

export default function LoginModal() {
  const { open, handleOpen, handleClose } = useModal();

  // TODO: fix styling
  return (
    <>
      <Button onClick={handleOpen}>Open Modal</Button>
      <Modal open={open} onClose={handleClose}>
        <Grid
          container={true}
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100vh", width: "100vw" }}
        >
          <Card sx={{ px: 5, py: 1, borderRadius: 1 }}>
            <Typography fontFamily="sans-serif" variant="h5">
              Login Required
            </Typography>
            <CardContent>
              <Grid container={true} direction="column" rowGap={2}>
                <Input placeholder="Username" />
                <Input placeholder="Password" type="password" />
              </Grid>
            </CardContent>
            <CardActions>
              <Button variant="contained" onClick={handleClose}>
                Login
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Modal>
    </>
  );
}

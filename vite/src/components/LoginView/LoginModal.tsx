import { useAuthContext } from "@/providers/AuthProvider";
import {
  Button,
  Grid,
  Modal,
  Card,
  Typography,
  CardContent,
  CardActions,
  TextField,
  keyframes,
  SxProps,
} from "@mui/material";
import { useCallback, useState } from "react";

const shakeKeyframes = keyframes`
  0% {  transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
`;

const shake: SxProps = {
  animation: `${shakeKeyframes} 0.5s`,
};

const shakeReverse: SxProps = {
  animation: `${shakeKeyframes} 0.5s reverse`,
};

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { login } = useAuthContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(({ target: { value } }) => {
      setUsername(value);
    }, []);

  const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(({ target: { value } }) => {
      setPassword(value);
    }, []);

  const handleLoginButtonClick = useCallback(async () => {
    try {
      // throw Error("test");
      await login(username, password);
    } catch (err) {
      // console.error(err);
      setIsError(true);
      // TODO: fix me: breaks when spamming login button
      // use state reducer?
      setTimeout(() => setIsError(false), 500);
      return;
    }
    onClose();
  }, [onClose, login, username, password]);

  const handleEnterKeyPress: React.KeyboardEventHandler<HTMLDivElement> =
    useCallback(
      ({ key }) => {
        if (key === "Enter") {
          handleLoginButtonClick();
        }
      },
      [handleLoginButtonClick]
    );

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Grid
          container={true}
          justifyContent="center"
          alignItems="center"
          sx={{ height: "100vh", width: "100vw" }}
        >
          <Card sx={{ px: 5, py: 1, borderRadius: 1 }}>
            <CardContent>
              <Grid
                container={true}
                justifyContent="center"
                alignItems="center"
                rowGap={1}
              >
                <Typography fontFamily="sans-serif" variant="h5" sx={{ mb: 2 }}>
                  Login Required
                </Typography>
                <Grid container={true} direction="column" rowGap={2}>
                  <TextField
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    onKeyDown={handleEnterKeyPress}
                    error={isError}
                    sx={isError ? shake : {}}
                  />
                  <TextField
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleEnterKeyPress}
                    error={isError}
                    sx={isError ? shakeReverse : {}}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button
                fullWidth={true}
                variant="contained"
                onClick={handleLoginButtonClick}
              >
                Login
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Modal>
    </>
  );
}

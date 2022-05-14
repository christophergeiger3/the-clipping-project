import {
  Autocomplete,
  Button,
  ButtonGroup,
  Grid,
  Snackbar,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Video from "./Video";
import axios from "axios";
import * as React from "react";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import LoadingButton from "@mui/lab/LoadingButton";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ClipView() {
  const [url, setUrl] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );
  const [title, setTitle] = useState(`${Math.floor(Math.random() * 1e15)}`);
  const [extension, setExtension] = useState("mp4");
  const [startEndTimes, setStartEndTimes] = useState<number[]>([0, 100]);
  const [videoUrl, setVideoUrl] = useState(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  );
  const [isLoadingURL, setIsLoadingURL] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const handleOpenSnackbar = useCallback((snackbarText?: string) => {
    setSnackbarText(snackbarText || "");
    setSnackbarOpen(true);
  }, []);

  const handleCloseSnackbar = useCallback(
    (_event?: React.SyntheticEvent | Event, _reason?: string) => {
      setSnackbarOpen(false);
    },
    []
  );

  const handleURLChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setUrl(e.target.value);
    },
    []
  );

  const handleAutocompleteChange = useCallback(
    (_e: React.ChangeEvent<{}>, value: string | null) => {
      if (value) {
        setExtension(value);
      }
    },
    []
  );

  const handleSubmitURL = useCallback(async () => {
    // console.log(`getting video url for: ${url}`);
    setIsLoadingURL(true);
    const { data } = await axios.post(`http://localhost:3000/analyze`, {
      url,
    });
    console.log(data[0]);
    setVideoUrl(data[0]);
    setIsLoadingURL(false);
  }, [url]);

  const handleTitleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    []
  );

  const handleClip = useCallback(async () => {
    if (title === "") {
      // TODO: do actual validation / error handling
      return;
    }
    console.log(
      `clipping video: ${videoUrl}, from ${startEndTimes[0]} to ${startEndTimes[1]}`,
      `filename: ${title}.${extension}`
    );
    const ret = await axios.post(`http://localhost:3000/clips`, {
      url: videoUrl,
      start: startEndTimes[0] * 1000, // TODO: * 1000 is a hack, fix me!
      end: startEndTimes[1] * 1000, // TODO: * 1000 is a hack, fix me!
      output: `${title}.${extension}`,
    });
    console.log("response:", ret.data);
    console.log(`http://localhost:3001/clips/progress/${ret.data._id}`);
    handleOpenSnackbar(
      `Clipping to http://localhost:3000/${title}.${extension}`
    );
  }, [videoUrl, startEndTimes, title, extension, handleOpenSnackbar]);

  const handleCopyDestinationURL = useCallback(() => {
    navigator.clipboard.writeText(
      `http://localhost:3000/${title}.${extension}`
    );
    handleOpenSnackbar(`Copied destination URL to clipboard`);
  }, [title, extension, handleOpenSnackbar]);

  return (
    <>
      <Video
        src={videoUrl}
        startEndTimes={startEndTimes}
        onUpdateStartEndTimes={setStartEndTimes}
      />

      <Grid container={true} spacing={2} pb={1} alignItems="center">
        <Grid item={true} xs={10}>
          <TextField
            fullWidth={true}
            value={url}
            variant="outlined"
            label="Video URL"
            onChange={handleURLChange}
          />
        </Grid>
        <Grid item={true} xs={2}>
          <LoadingButton
            variant="contained"
            loading={isLoadingURL}
            onClick={handleSubmitURL}
          >
            Submit
          </LoadingButton>
        </Grid>
      </Grid>

      <Grid container={true} spacing={2} pb={1} alignItems="center">
        <Grid item={true} xs={8}>
          <TextField
            fullWidth={true}
            value={title}
            variant="outlined"
            label="Clip Title"
            onChange={handleTitleChange}
          />
        </Grid>
        <Grid item={true} xs={2}>
          <Autocomplete
            options={["mp4", "webm", "ogg", "mov"]}
            value={extension}
            freeSolo={true}
            renderInput={(params) => (
              <TextField
                {...params}
                label="File Extension"
                variant="outlined"
              />
            )}
            onChange={handleAutocompleteChange}
          />
        </Grid>
        <Grid item={true} xs={2}>
          <ButtonGroup variant="contained" color="primary">
            <Button onClick={handleClip}>Clip</Button>
            <Button
              onClick={handleCopyDestinationURL}
              startIcon={<ContentCopyIcon />}
            />
          </ButtonGroup>
          {/* <Button variant="contained" onClick={handleClip}>
            Clip
          </Button>
          <Button
            variant="contained"
            startIcon={<ContentCopyIcon />}
            onClick={handleCopyDestinationURL}
          /> */}
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarText}
        </Alert>
      </Snackbar>
    </>
  );
}

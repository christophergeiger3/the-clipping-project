import {
  Alert,
  Autocomplete,
  Button,
  ButtonGroup,
  CardContent,
  Grid,
  TextField,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useCallback, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Video from "./Video";
import * as React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSnackbar } from "notistack";
import { useClient } from "../../providers/ApiProvider";

export default function ClipView() {
  const { enqueueSnackbar } = useSnackbar();
  const { client } = useClient();

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
  const [isLoadingClip, setIsLoadingClip] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

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
    // Validation
    if (!url) {
      setValidationError("URL is required");
      return;
    }
    // Check if URL contains spaces
    if (url.includes(" ")) {
      setValidationError("URL cannot contain spaces");
      return;
    }
    setValidationError(null);

    setIsLoadingURL(true);

    const request = await client;
    type AnalyzeResponse = ReturnType<typeof request.AnalyzeController_analyze>;
    let response: Awaited<AnalyzeResponse>;
    try {
      response = await request.AnalyzeController_analyze(null, {
        url,
      });
    } catch (err) {
      setIsLoadingURL(false);
      // @ts-expect-error err is of type unknown
      enqueueSnackbar(err.message, { variant: "error" });
      return;
    }

    // if (response.status === 404) {
    //   enqueueSnackbar(response.statusText, { variant: "error" });
    //   setIsLoadingURL(false);
    //   return;
    // }

    setVideoUrl(response.data[0]);
    setIsLoadingURL(false);
    enqueueSnackbar("Video URL parsed and set as player source", {
      variant: "info",
    });
  }, [client, enqueueSnackbar, url]);

  const handleTitleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
    },
    []
  );

  const handleClip = useCallback(async () => {
    // Validation
    if (!videoUrl) {
      setValidationError("Video URL is required");
      return;
    }
    if (!title) {
      setValidationError("Title is required");
      return;
    }
    if (title.includes(" ")) {
      setValidationError("Title cannot contain spaces");
      return;
    }
    if (startEndTimes[0] >= startEndTimes[1]) {
      setValidationError("Start time must be less than end time");
      return;
    }
    if (!extension) {
      setValidationError("Extension is required");
      return;
    }
    if (extension.includes(" ")) {
      setValidationError("Extension cannot contain spaces");
      return;
    }

    setValidationError(null);
    setIsLoadingClip(true);
    const request = await client;
    const response = await request.ClipsController_create(null, {
      url: videoUrl,
      start: startEndTimes[0],
      end: startEndTimes[1],
      output: `${title}.${extension}`,
    });
    setIsLoadingClip(false);
    const clip = response.data;
    enqueueSnackbar(
      `Clipping to ${process.env.REACT_APP_API_URL}/${clip.output}`,
      {
        variant: "success",
      }
    );
  }, [client, videoUrl, startEndTimes, title, extension, enqueueSnackbar]);

  const handleCopyDestinationURL = useCallback(() => {
    navigator.clipboard.writeText(
      `${process.env.REACT_APP_API_URL}/${title}.${extension}`
    );
    enqueueSnackbar(`Copied destination URL to clipboard`, {
      variant: "info",
    });
  }, [title, extension, enqueueSnackbar]);

  return (
    <>
      <Video
        src={videoUrl}
        startEndTimes={startEndTimes}
        onUpdateStartEndTimes={setStartEndTimes}
      />

      {validationError ? (
        <CardContent sx={{ backgroundColor: "#D3D3D3" }}>
          <Alert sx={{ backgroundColor: "#c3c3c3" }} severity="error">
            {validationError}
          </Alert>
        </CardContent>
      ) : null}

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
            <LoadingButton
              variant="contained"
              loading={isLoadingClip}
              onClick={handleClip}
            >
              Clip
            </LoadingButton>
            <Button
              onClick={handleCopyDestinationURL}
              startIcon={<ContentCopyIcon />}
            />
          </ButtonGroup>
        </Grid>
      </Grid>

      <Grid pt={1} pb={2} container={true}>
        <Button
          startIcon={<OpenInNewIcon />}
          fullWidth={true}
          href="/clips"
          target="_blank"
          variant="contained"
          color="info"
        >
          View all clips
        </Button>
      </Grid>
    </>
  );
}

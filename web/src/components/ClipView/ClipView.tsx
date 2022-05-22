import {
  Autocomplete,
  Button,
  ButtonGroup,
  Grid,
  TextField,
} from "@mui/material";
import { useCallback, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Video from "./Video";
import axios from "axios";
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
    const response = await (
      await client
    ).ClipsController_create(null, {
      url: videoUrl,
      start: startEndTimes[0],
      end: startEndTimes[1],
      output: `${title}.${extension}`,
    });
    const clip = response.data;
    enqueueSnackbar(`Clipping to http://localhost:3000/${clip.output}`, {
      variant: "success",
    });
  }, [client, videoUrl, startEndTimes, title, extension, enqueueSnackbar]);

  const handleCopyDestinationURL = useCallback(() => {
    navigator.clipboard.writeText(
      `http://localhost:3000/${title}.${extension}`
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
        </Grid>
      </Grid>
    </>
  );
}

import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import SaveIcon from "@mui/icons-material/Save";
import { useClipDispatch, useClipState } from "@providers/ClipProvider";
import {
  Grid,
  IconButton,
  Paper,
  SxProps,
  TextField,
  Theme,
  Tooltip,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { randomNDigitNumber } from "@/utils/random";
import { analyzeControllerAnalyze, clipsControllerCreate } from "@/api";
import { SetPlayerSource } from "@/reducers/clip.action";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

const PAPER_STYLE: SxProps<Theme> = { padding: 1 };

type IconButtonProps = Parameters<typeof IconButton>[number];

function PreviewVideoIcon({ ...props }: IconButtonProps) {
  return (
    <Tooltip title="Preview video in player">
      <IconButton color="primary" {...props}>
        <OndemandVideoIcon />
      </IconButton>
    </Tooltip>
  );
}

function SaveClipIcon({ ...props }: IconButtonProps) {
  return (
    <Tooltip title="Save clip">
      <IconButton color="primary" {...props}>
        <SaveIcon />
      </IconButton>
    </Tooltip>
  );
}

function PreviewVideoInput() {
  const { src } = useClipState();
  const dispatch = useClipDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState(src);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { value } }) => {
      setUrl(value);
    },
    []
  );

  const handlePreview: React.MouseEventHandler<HTMLButtonElement> =
    useCallback(async () => {
      setIsLoading(true);
      const response = await analyzeControllerAnalyze({ url });
      const analyzedUrl = response.data[0];

      dispatch(new SetPlayerSource({ src: analyzedUrl, originalUrl: url }));
      setIsLoading(false);
    }, [dispatch, url]);

  const StartIcon = useCallback(
    () => (isLoading ? null : <PreviewVideoIcon />),
    [isLoading]
  );

  return (
    <Grid container={true} item={true} alignItems="center" columns={100} p={1}>
      <Grid item={true} xs={90} sm={94} lg={96}>
        <TextField
          fullWidth={true}
          label="Video URL"
          value={url}
          onChange={handleChange}
        />
      </Grid>
      <Grid item={true} xs={10} sm={6} lg={4} textAlign="center">
        <LoadingButton
          startIcon={<StartIcon />}
          onClick={handlePreview}
          loading={isLoading}
          loadingPosition="center"
        />
      </Grid>
    </Grid>
  );
}

function ClipTitleInput() {
  const { enqueueSnackbar } = useSnackbar();
  const { start, end, originalUrl } = useClipState();
  const [title, setTitle] = useState(randomNDigitNumber(15).toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    ({ target: { value } }) => {
      setTitle(value);
    },
    []
  );

  const handleSaveClip = useCallback(async () => {
    setIsLoading(true);
    try {
      await clipsControllerCreate({
        name: title,
        url: originalUrl,
        start,
        end,
      });
    } catch (e) {
      enqueueSnackbar("Clip creation failed", {
        variant: "error",
      });
    }
    setIsLoading(false);
    enqueueSnackbar("Clip download in progress...", { variant: "success" });

    setTitle(randomNDigitNumber(15).toString());
  }, [end, enqueueSnackbar, originalUrl, start, title]);

  const StartIcon = useCallback(
    () => (isLoading ? null : <SaveClipIcon />),
    [isLoading]
  );

  return (
    <Grid container={true} item={true} alignItems="center" columns={100} p={1}>
      <Grid item={true} xs={90} sm={94} lg={96}>
        <TextField
          fullWidth={true}
          label="Clip Title"
          value={title}
          onChange={handleChange}
        />
      </Grid>
      <Grid item={true} xs={10} sm={6} lg={4} textAlign="center">
        <LoadingButton
          startIcon={<StartIcon />}
          onClick={handleSaveClip}
          loading={isLoading}
          loadingPosition="center"
        />
      </Grid>
    </Grid>
  );
}

export default function ClippingControlPanel() {
  return (
    <Grid item={true} padding={2}>
      <Paper elevation={1} sx={PAPER_STYLE}>
        <Grid
          container={true}
          alignItems="center"
          direction="column"
          rowGap={2}
        >
          <PreviewVideoInput />
          <ClipTitleInput />
        </Grid>
      </Paper>
    </Grid>
  );
}

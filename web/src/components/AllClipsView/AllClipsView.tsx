import {
  Clip,
  useClipsControllerFindAll,
  useClipsControllerRemove,
} from "@/api";
import { API_URL } from "@/env";
import { useEventSource } from "@/hooks/useEventSource";
import getClipURL from "@/utils/getClipURL";
import { isNullable } from "@/utils/isNonNullable";
import {
  convertDurationToHumanReadable,
  convertMillisecondsToTimestamp,
} from "@/utils/timestamp";
import { Check, Error } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import { useCallback } from "react";
import { SpinningHourglass } from "../SpinningHourglass";

// TODO: get types from orval, instead of hardcoding here
type ClipStatus = "done" | "processing" | "idle" | "error";

// NTS: this would be a good use case for new ts "satisfies"
const StatusToClipCardIcon = {
  done: <Check color="success" />,
  processing: <SpinningHourglass />,
  idle: <SpinningHourglass color="warning" />,
  error: <Error color="error" />,
} as const;

type IconButtonProps = Parameters<typeof IconButton>[number];

function DeleteClipIcon({ ...props }: IconButtonProps) {
  return (
    <Tooltip title="Delete this clip">
      <IconButton color="warning" {...props}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
}

function ClipProgressBar({ clip }: { clip: Clip }) {
  const progress = useEventSource(`${API_URL}/clips/${clip._id}/progress`);

  if (isNullable(progress)) {
    return null;
  }

  if (progress === -1) {
    // Return loading bar (clip is not active)
    return <LinearProgress />;
  }

  return (
    <>
      <LinearProgress variant="determinate" value={progress} />
      <Typography variant="h6">{progress}%</Typography>
    </>
  );
}

function ClipCard({ clip, onDelete }: { clip: Clip; onDelete?: () => void }) {
  const Icon = StatusToClipCardIcon[clip.status as ClipStatus];

  const linkToClip = getClipURL(clip);

  const clipStartTimestamp = convertMillisecondsToTimestamp(clip.start);
  const clipEndTimestamp = convertMillisecondsToTimestamp(clip.end);

  const durationTooltip = `${clipStartTimestamp} - ${clipEndTimestamp}`;
  const duration = convertDurationToHumanReadable(clip.end - clip.start);

  const { mutate: deleteClip } = useClipsControllerRemove();

  const handleDelete: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      e.preventDefault();
      deleteClip({ id: clip._id }, { onSettled: onDelete });
    },
    [deleteClip, clip._id, onDelete]
  );

  return (
    <Grid mb={2}>
      <Card>
        <CardHeader title={clip.name} avatar={Icon} subheader={clip.url} />
        <CardActionArea href={linkToClip} target="_blank">
          <CardContent>
            <Grid container={true} direction="column">
              {clip.status === "processing" ? (
                <ClipProgressBar clip={clip} />
              ) : null}
              <Tooltip title={durationTooltip}>
                <Typography>{duration}</Typography>
              </Tooltip>
            </Grid>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <DeleteClipIcon onClick={handleDelete} />
        </CardActions>
      </Card>
    </Grid>
  );
}

function NoClipsMessage() {
  return (
    <Grid container={true} columns={100} m={3} gap={2}>
      <Grid item={true} xs={10} md={15} xl={30} />
      <Grid item={true} xs={80} md={70} xl={40}>
        <Typography variant="h4" align="center" mb={4}>
          It looks like there aren&apos;t any clips yet -- try creating one!
        </Typography>
        <Button href="/" fullWidth={true} variant="contained">
          Start Clipping
        </Button>
      </Grid>
      <Grid item={true} xs={10} md={15} xl={30} />
    </Grid>
  );
}

/** Center horizontally and vertically across the entire page */
function FullyCenterOnPage({ children }: { children: React.ReactNode }) {
  return (
    <Grid
      container={true}
      justifyContent="center"
      alignItems="center"
      sx={{ height: "100vh" }}
    >
      {children}
    </Grid>
  );
}

export default function AllClipsView() {
  const { data: response, refetch } = useClipsControllerFindAll();
  const clips = response?.data;

  if (clips === undefined) {
    return (
      <FullyCenterOnPage>
        <CircularProgress />
      </FullyCenterOnPage>
    );
  }

  if (clips.length === 0) {
    return (
      <FullyCenterOnPage>
        <NoClipsMessage />
      </FullyCenterOnPage>
    );
  }

  return (
    <Grid container={true} columns={100} m={3} gap={2}>
      <Grid item={true} xs={2} md={5} xl={10} />
      <Grid item={true} xs={96} md={90} xl={80}>
        {clips.map((clip) => (
          <ClipCard key={clip._id} clip={clip} onDelete={refetch} />
        ))}
      </Grid>
      <Grid item={true} xs={2} md={5} xl={10} />
    </Grid>
  );
}

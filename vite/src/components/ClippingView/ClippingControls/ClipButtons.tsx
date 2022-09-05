import IconButton from "@mui/material/IconButton";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import Tooltip from "@mui/material/Tooltip";
import { useCallback } from "react";
import { toSeconds } from "../../../utils/timestamp";
import { ActionType } from "../../../utils/reducers/clipReducer";
import { useClipContext } from "../../../providers/ClipProvider";
import { Grid } from "@mui/material";

// see: https://www.typescriptlang.org/play#example/nominal-typing
type milliseconds = number & { __brand: "milliseconds" };

const INCREMENT_AMOUNT_IMPRECISE = 1000 as milliseconds;
const DECREMENT_AMOUNT_IMPRECISE = -1000 as milliseconds;

interface IncrementClipByAmountProps {
  amount: milliseconds;
}

interface IncrementClipStartEndButtonProps extends IncrementClipByAmountProps {
  type: ActionType.ADD_TO_CLIP_START_TIME | ActionType.ADD_TO_CLIP_END_TIME;
  description: string;
}

export function JumpToEndOfClipButton() {
  const { dispatch } = useClipContext();
  const handleClick = useCallback(() => {
    dispatch({ type: ActionType.JUMP_TO_CLIP_END });
  }, [dispatch]);

  return (
    <Grid item={true}>
      <Tooltip title="Jump to the end of the clip">
        <IconButton onClick={handleClick}>
          <SkipNextIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
}

export function JumpToStartOfClipButton() {
  const { dispatch } = useClipContext();
  const handleClick = useCallback(() => {
    dispatch({ type: ActionType.JUMP_TO_CLIP_START });
  }, [dispatch]);

  return (
    <Grid item={true}>
      <Tooltip title="Jump to the start of the clip">
        <IconButton onClick={handleClick}>
          <SkipPreviousIcon />
        </IconButton>
      </Tooltip>
    </Grid>
  );
}

function IncrementClipStartEndButton({
  amount,
  type,
  description,
}: IncrementClipStartEndButtonProps) {
  const { dispatch } = useClipContext();
  const isIncreasing = amount > 0;
  const icon = isIncreasing ? <RedoIcon /> : <UndoIcon />;

  const handleClick = useCallback(() => {
    dispatch({ type, amount });
  }, [dispatch, amount, type]);

  return (
    <Grid item={true}>
      <Tooltip title={description}>
        <IconButton onClick={handleClick}>{icon}</IconButton>
      </Tooltip>
    </Grid>
  );
}

function IncrementClipStartByAmount({ amount }: IncrementClipByAmountProps) {
  const type = ActionType.ADD_TO_CLIP_START_TIME;
  const increaseOrDecrease = amount > 0 ? "Increase" : "Decrease";
  const description = `${increaseOrDecrease} the start of the clip by ${toSeconds(
    Math.abs(amount)
  )}`;
  return (
    <IncrementClipStartEndButton
      amount={amount}
      type={type}
      description={description}
    />
  );
}

function IncrementClipEndByAmount({ amount }: IncrementClipByAmountProps) {
  const type = ActionType.ADD_TO_CLIP_END_TIME;
  const increaseOrDecrease = amount > 0 ? "Increase" : "Decrease";
  const description = `${increaseOrDecrease} the end of the clip by ${toSeconds(
    Math.abs(amount)
  )}`;
  return (
    <IncrementClipStartEndButton
      amount={amount}
      type={type}
      description={description}
    />
  );
}

export function IncreaseClipStartButton() {
  const amount = INCREMENT_AMOUNT_IMPRECISE;
  return <IncrementClipStartByAmount amount={amount} />;
}

export function DecreaseClipStartButton() {
  const amount = DECREMENT_AMOUNT_IMPRECISE;
  return <IncrementClipStartByAmount amount={amount} />;
}

export function IncreaseClipEndButton() {
  const amount = INCREMENT_AMOUNT_IMPRECISE;
  return <IncrementClipEndByAmount amount={amount} />;
}

export function DecreaseClipEndButton() {
  const amount = DECREMENT_AMOUNT_IMPRECISE;
  return <IncrementClipEndByAmount amount={amount} />;
}

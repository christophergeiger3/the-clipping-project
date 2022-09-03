import IconButton from "@mui/material/IconButton";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import Tooltip from "@mui/material/Tooltip";
import { Dispatch, useCallback } from "react";
import { ActionType, ClipAction } from "../ClippingView";
import { toSeconds } from "../../../utils/timestamp";

// see: https://www.typescriptlang.org/play#example/nominal-typing
type milliseconds = number & { __brand: "milliseconds" };

const INCREMENT_AMOUNT_IMPRECISE = 1000 as milliseconds;
const DECREMENT_AMOUNT_IMPRECISE = -1000 as milliseconds;

interface DispatchProp {
  dispatch: Dispatch<ClipAction>;
}

interface IncrementClipByAmountProps extends DispatchProp {
  amount: milliseconds;
}

interface IncrementClipStartEndButtonProps extends IncrementClipByAmountProps {
  type: ActionType.ADD_TO_CLIP_START_TIME | ActionType.ADD_TO_CLIP_END_TIME;
  description: string;
}

export function JumpToEndOfClipButton({ dispatch }: DispatchProp) {
  const handleClick = useCallback(() => {
    dispatch({ type: ActionType.JUMP_TO_CLIP_END });
  }, [dispatch]);

  return (
    <Tooltip title="Jump to the end of the clip">
      <IconButton onClick={handleClick}>
        <SkipNextIcon />
      </IconButton>
    </Tooltip>
  );
}

export function JumpToStartOfClipButton({ dispatch }: DispatchProp) {
  const handleClick = useCallback(() => {
    dispatch({ type: ActionType.JUMP_TO_CLIP_START });
  }, [dispatch]);

  return (
    <Tooltip title="Jump to the start of the clip">
      <IconButton onClick={handleClick}>
        <SkipPreviousIcon />
      </IconButton>
    </Tooltip>
  );
}

function IncrementClipStartEndButton({
  dispatch,
  amount,
  type,
  description,
}: IncrementClipStartEndButtonProps) {
  const isIncreasing = amount > 0;
  const icon = isIncreasing ? <RedoIcon /> : <UndoIcon />;

  const handleClick = useCallback(() => {
    dispatch({ type, amount });
  }, [dispatch, amount, type]);

  return (
    <Tooltip title={description}>
      <IconButton onClick={handleClick}>{icon}</IconButton>
    </Tooltip>
  );
}

function IncrementClipStartByAmount({
  amount,
  dispatch,
}: IncrementClipByAmountProps) {
  const type = ActionType.ADD_TO_CLIP_START_TIME;
  const increaseOrDecrease = amount > 0 ? "Increase" : "Decrease";
  const description = `${increaseOrDecrease} the start of the clip by ${toSeconds(
    Math.abs(amount)
  )}`;
  return (
    <IncrementClipStartEndButton
      dispatch={dispatch}
      amount={amount}
      type={type}
      description={description}
    />
  );
}

function IncrementClipEndByAmount({
  amount,
  dispatch,
}: IncrementClipByAmountProps) {
  const type = ActionType.ADD_TO_CLIP_END_TIME;
  const increaseOrDecrease = amount > 0 ? "Increase" : "Decrease";
  const description = `${increaseOrDecrease} the end of the clip by ${toSeconds(
    Math.abs(amount)
  )}`;
  return (
    <IncrementClipStartEndButton
      dispatch={dispatch}
      amount={amount}
      type={type}
      description={description}
    />
  );
}

export function IncreaseClipStartButton({ dispatch }: DispatchProp) {
  const amount = INCREMENT_AMOUNT_IMPRECISE;
  return <IncrementClipStartByAmount dispatch={dispatch} amount={amount} />;
}

export function DecreaseClipStartButton({ dispatch }: DispatchProp) {
  const amount = DECREMENT_AMOUNT_IMPRECISE;
  return <IncrementClipStartByAmount dispatch={dispatch} amount={amount} />;
}

export function IncreaseClipEndButton({ dispatch }: DispatchProp) {
  const amount = INCREMENT_AMOUNT_IMPRECISE;
  return <IncrementClipEndByAmount dispatch={dispatch} amount={amount} />;
}

export function DecreaseClipEndButton({ dispatch }: DispatchProp) {
  const amount = DECREMENT_AMOUNT_IMPRECISE;
  return <IncrementClipEndByAmount dispatch={dispatch} amount={amount} />;
}

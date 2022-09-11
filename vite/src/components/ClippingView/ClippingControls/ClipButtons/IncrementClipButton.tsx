import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Grid } from "@mui/material";
import { useCallback } from "react";
import {
  milliseconds,
  INCREMENT_AMOUNT_IMPRECISE,
  DECREMENT_AMOUNT_IMPRECISE,
} from "./constants";
import { toSeconds } from "../../../../utils/timestamp";
import { ActionType } from "../../../../reducers/clipReducer";
import { useClipDispatch } from "../../../../providers/ClipProvider";

interface IncrementClipByAmountProps {
  amount: milliseconds;
}

interface IncrementClipStartOrClipEnd extends IncrementClipByAmountProps {
  type: ActionType.ADD_TO_CLIP_START_TIME | ActionType.ADD_TO_CLIP_END_TIME;
  description: string;
}

function IncrementClipStartOrClipEnd({
  amount,
  type,
  description,
}: IncrementClipStartOrClipEnd) {
  const dispatch = useClipDispatch();
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
    <IncrementClipStartOrClipEnd
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
    <IncrementClipStartOrClipEnd
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

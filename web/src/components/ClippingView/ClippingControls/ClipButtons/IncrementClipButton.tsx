import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { Grid } from "@mui/material";
import { useCallback } from "react";
import {
  INCREMENT_AMOUNT_IMPRECISE,
  DECREMENT_AMOUNT_IMPRECISE,
} from "./constants";
import { toSeconds } from "@utils/timestamp";
import { useClipDispatch } from "@providers/ClipProvider";
import {
  AddAmountToClipEnd,
  AddAmountToClipStart,
} from "@/reducers/clip.action";
import { milliseconds } from "@/types";

interface IncrementClipByAmountProps {
  amount: milliseconds;
}

interface IncrementClipStartOrClipEnd extends IncrementClipByAmountProps {
  Action: typeof AddAmountToClipStart | typeof AddAmountToClipEnd;
  description: string;
}

function IncrementClipStartOrClipEnd({
  Action,
  amount,
  description,
}: IncrementClipStartOrClipEnd) {
  const dispatch = useClipDispatch();
  const isIncreasing = amount > 0;
  const icon = isIncreasing ? <RedoIcon /> : <UndoIcon />;

  const handleClick = useCallback(() => {
    dispatch(new Action({ amount }));
  }, [dispatch, Action, amount]);

  return (
    <Grid item={true}>
      <Tooltip title={description}>
        <IconButton onClick={handleClick}>{icon}</IconButton>
      </Tooltip>
    </Grid>
  );
}

function IncrementClipStartByAmount({ amount }: IncrementClipByAmountProps) {
  const increaseOrDecrease = amount > 0 ? "Increase" : "Decrease";
  const description = `${increaseOrDecrease} the start of the clip by ${toSeconds(
    Math.abs(amount)
  )}`;
  return (
    <IncrementClipStartOrClipEnd
      Action={AddAmountToClipStart}
      amount={amount}
      description={description}
    />
  );
}

function IncrementClipEndByAmount({ amount }: IncrementClipByAmountProps) {
  const increaseOrDecrease = amount > 0 ? "Increase" : "Decrease";
  const description = `${increaseOrDecrease} the end of the clip by ${toSeconds(
    Math.abs(amount)
  )}`;
  return (
    <IncrementClipStartOrClipEnd
      Action={AddAmountToClipEnd}
      amount={amount}
      description={description}
    />
  );
}

export function IncreaseClipStartButton() {
  return <IncrementClipStartByAmount amount={INCREMENT_AMOUNT_IMPRECISE} />;
}

export function DecreaseClipStartButton() {
  return <IncrementClipStartByAmount amount={DECREMENT_AMOUNT_IMPRECISE} />;
}

export function IncreaseClipEndButton() {
  return <IncrementClipEndByAmount amount={INCREMENT_AMOUNT_IMPRECISE} />;
}

export function DecreaseClipEndButton() {
  return <IncrementClipEndByAmount amount={DECREMENT_AMOUNT_IMPRECISE} />;
}

import { ClipAction } from "./clip.action";
import ClipState from "./clip.state";

export default function reducer(state: ClipState, action: ClipAction) {
  return action.execute(state);
}

import { DISPLAY_LOGIN, CLOSE_LOGIN } from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = false;
  }
  switch (action.type) {
    case DISPLAY_LOGIN:
      return true;
    case CLOSE_LOGIN:
      return false;
    default:
      return state;
  }
}

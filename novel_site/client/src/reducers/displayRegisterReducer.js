import { DISPLAY_REGISTER, CLOSE_REGISTER } from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = false;
  }
  switch (action.type) {
    case DISPLAY_REGISTER:
      return true;
    case CLOSE_REGISTER:
      return false;
    default:
      return state;
  }
}

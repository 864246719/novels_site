import { SAVE_CURRENT_PAGE_INDEX } from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = 1;
  }
  switch (action.type) {
    case SAVE_CURRENT_PAGE_INDEX:
      return action.payload;
    default:
      return state;
  }
}

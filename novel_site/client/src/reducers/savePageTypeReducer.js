import { SAVE_PAGE_TYPE } from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = 0;
  }
  switch (action.type) {
    case SAVE_PAGE_TYPE:
      return action.payload;
    default:
      return state;
  }
}

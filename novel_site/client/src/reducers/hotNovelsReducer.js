import {
  FETCH_HOT_NOVELS,
  RESTORE_HOTNOVELS,
  ADD_HOT_NOVELS
} from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = [[], [], [], [], [], []];
  }
  switch (action.type) {
    case FETCH_HOT_NOVELS:
      return action.payload;
    case RESTORE_HOTNOVELS:
      return action.payload;
    case ADD_HOT_NOVELS:
      return action.payload;
    default:
      return state;
  }
}

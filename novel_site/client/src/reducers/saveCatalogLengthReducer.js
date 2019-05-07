import { SAVE_CATALOG_LENGTH } from "../actions/types";
export default function(state, action) {
  if (!state) {
    state = null;
  }
  switch (action.type) {
    case SAVE_CATALOG_LENGTH:
      return action.payload;
    default:
      return state;
  }
}

import { FETCH_SEARCH_RESULT, CLEAR_SEARCH_RESULT } from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = [];
  }
  switch (action.type) {
    case FETCH_SEARCH_RESULT:
      return action.payload;
    case CLEAR_SEARCH_RESULT:
      return [];
    default:
      return state;
  }
}

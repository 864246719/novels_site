import { FETCH_USER, CLEAR_USER_INFO } from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = {};
  }
  switch (action.type) {
    case FETCH_USER:
      return action.payload;
    case CLEAR_USER_INFO:
      return {};
    default:
      return state;
  }
}

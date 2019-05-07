import {
  FETCH_SINGLE_GENRE_NOVELS,
  CLEAR_SINGLE_GENRE_NOVELS
} from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = [];
  }

  switch (action.type) {
    case FETCH_SINGLE_GENRE_NOVELS:
      return action.payload;
    case CLEAR_SINGLE_GENRE_NOVELS:
      return [];
    default:
      return state;
  }
}

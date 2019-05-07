import { FETCH_IMG, FETCH_IMGS } from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = [];
  }

  switch (action.type) {
    case FETCH_IMG:
      return [...state, action.payload];
    case FETCH_IMGS:
      return [...state, ...action.payload];
    default:
      return state;
  }
}

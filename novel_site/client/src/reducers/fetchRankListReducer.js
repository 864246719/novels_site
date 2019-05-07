import { FETCH_RANKLIST, CLEAR_RANKING_LIST } from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = [];
  }

  switch (action.type) {
    case FETCH_RANKLIST:
      return [...state, ...action.payload];
    case CLEAR_RANKING_LIST:
      return [];
    default:
      return state;
  }
}

import {
  FETCH_CATALOG,
  RESTORE_CATALOG,
  CLEAR_CATALOG
} from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = [];
  }
  switch (action.type) {
    case FETCH_CATALOG:
      return [...state, action.payload];
    case RESTORE_CATALOG:
      return action.payload;
    case CLEAR_CATALOG:
      return [];
    default:
      return state;
  }
}

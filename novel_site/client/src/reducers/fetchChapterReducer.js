import {
  FETCH_CHAPTER_CONTENT,
  RESTORE_CHAPTERS,
  CLEAR_CHAPTER_CONTENT,
  FETCH_CHAPTER_CONTENTS
} from "../actions/types";

export default function(state, action) {
  if (!state) {
    state = [];
  }
  switch (action.type) {
    case FETCH_CHAPTER_CONTENT:
      return [...state, action.payload];
    case FETCH_CHAPTER_CONTENTS:
      return [...state, ...action.payload];
    case RESTORE_CHAPTERS:
      return action.payload;
    case CLEAR_CHAPTER_CONTENT:
      return [];

    default:
      return state;
  }
}

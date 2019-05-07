import { combineReducers } from "redux";
import displayLoginReducer from "./displayLoginReducer";
import displayRegister from "./displayRegisterReducer";
import userInfoReducer from "./userInfoReducer";
import hotNovelsReducer from "./hotNovelsReducer";
import fetchImgReducer from "./fetchImgReducer";
import fetchNovelReducer from "./fetchNovelReducer";
import fetchCatalogReducer from "./fetchCatalogReducer";
import fetchChapterReducer from "./fetchChapterReducer";
import saveCatalogLengthReducer from "./saveCatalogLengthReducer";
import saveCurrentPageIndexReducer from "./saveCurrentPageIndexReducer";
import fetchSearchResultReducer from "./fetchSearchResultReducer";
import fetchSingleGenreReducer from "./fetchSingleGenreReducer";
import savePageTypeReducer from "./savePageTypeReducer";
import fetchRankListReducer from "./fetchRankListReducer";

export default combineReducers({
  displayLoginStatus: displayLoginReducer,
  displayRegisterStatus: displayRegister,
  userInfo: userInfoReducer,
  hotNovels: hotNovelsReducer,
  singleGenreNovels: fetchSingleGenreReducer,
  images: fetchImgReducer,
  novel: fetchNovelReducer,
  catalog: fetchCatalogReducer,
  chapters: fetchChapterReducer,
  catalogLength: saveCatalogLengthReducer,
  currentPageIndex: saveCurrentPageIndexReducer,
  searchResult: fetchSearchResultReducer,
  pageType: savePageTypeReducer,
  rankList: fetchRankListReducer
});

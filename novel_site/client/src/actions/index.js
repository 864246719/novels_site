import axios from "axios";
import {
  DISPLAY_LOGIN,
  CLOSE_LOGIN,
  DISPLAY_REGISTER,
  CLOSE_REGISTER,
  FETCH_USER,
  CLEAR_USER_INFO,
  FETCH_HOT_NOVELS,
  ADD_HOT_NOVELS,
  FETCH_SINGLE_GENRE_NOVELS,
  CLEAR_SINGLE_GENRE_NOVELS,
  FETCH_IMG,
  FETCH_IMGS,
  CLEAR_HOT_NOVELS,
  CLEAR_IMG,
  FETCH_CATALOG,
  FETCH_CHAPTER_CONTENT,
  RESTORE_HOTNOVELS,
  RESTORE_CATALOG,
  RESTORE_CHAPTERS,
  CLEAR_CHAPTER_CONTENT,
  FETCH_CHAPTER_CONTENTS,
  CLEAR_CATALOG,
  SAVE_CATALOG_LENGTH,
  SAVE_CURRENT_PAGE_INDEX,
  FETCH_SEARCH_RESULT,
  CLEAR_SEARCH_RESULT,
  SAVE_PAGE_TYPE,
  FETCH_RANKLIST,
  CLEAR_RANKING_LIST
} from "./types";
export const displayLogin = () => {
  return {
    type: DISPLAY_LOGIN
  };
};

export const closeLogin = payload => {
  return {
    type: CLOSE_LOGIN
  };
};

export const displayRegister = () => {
  return {
    type: DISPLAY_REGISTER
  };
};

export const closeRegister = () => {
  return {
    type: CLOSE_REGISTER
  };
};

export const userRegister = userInfo => async dispatch => {
  let axiosSets = {
    method: "post",
    url: "/auth/register",
    data: {
      userInfo
    }
  };
  const res = await axios(axiosSets);
  dispatch({
    type: FETCH_USER,
    payload: res.data
  });
};

export const userLogin = accountInfo => async dispatch => {
  let axiosSets = {
    method: "post",
    url: "/auth/login",
    data: {
      accountInfo
    }
  };
  const res = await axios(axiosSets);
  dispatch({
    type: FETCH_USER,
    payload: res.data
  });
};

export const clearUserInfo = () => {
  return {
    type: CLEAR_USER_INFO
  };
};

export const logout = () => async dispatch => {
  let axiosSets = {
    method: "post",
    url: "/auth/logout"
  };
  await axios(axiosSets);
  dispatch({
    type: CLEAR_USER_INFO
  });
};

// =====================获取热榜（周榜）小说名单
export const fetchHotNovels = genreIds => async dispatch => {
  let axiosSets = {
    method: "post",
    url: "/api/weeklyNovels",
    data: {
      genreIds
    }
  };
  const res = await axios(axiosSets);
  dispatch({
    type: FETCH_HOT_NOVELS,
    payload: res.data.novels
  });
};

export const fetchSingleGenreNovels = genreId => async dispatch => {
  let axiosSets = {
    method: "post",
    url: "/api/genre",
    data: {
      genreId
    }
  };

  const res = await axios(axiosSets);
  dispatch({
    type: FETCH_SINGLE_GENRE_NOVELS,
    payload: res.data
  });
};

export const clearSingleGenreNovels = () => {
  return {
    type: CLEAR_SINGLE_GENRE_NOVELS
  };
};

export const addHotNovels = novels => (dispatch, getState) => {
  const hotNovels = getState()["hotNovels"];
  const existsNovelIds = [];

  for (let i = 0; i < hotNovels.length; i++) {
    for (let j = 0; j < hotNovels[i].length; j++) {
      existsNovelIds.push(hotNovels[i][j]["novel_id"]);
    }
  }

  const newNovels = [];

  for (let i = 0; i < novels.length; i++) {
    if (existsNovelIds.includes(novels[i]["novel_id"])) {
      continue;
    }
    newNovels.push(novels[i]);
  }

  for (let i = 0; i < newNovels.length; i++) {
    switch (newNovels[i]["novel_genre"]) {
      case 1:
        hotNovels[0].push(newNovels[i]);
        break;
      case 2:
        hotNovels[1].push(newNovels[i]);
        break;
      case 3:
        hotNovels[2].push(newNovels[i]);
        break;
      case 4:
        hotNovels[3].push(newNovels[i]);
        break;
      case 5:
        hotNovels[4].push(newNovels[i]);
        break;
      case 6:
        hotNovels[5].push(newNovels[i]);
        break;
      default:
        break;
    }
  }

  dispatch({
    type: ADD_HOT_NOVELS,
    payload: hotNovels
  });
};

export const clearHotNovels = () => {
  return {
    type: CLEAR_HOT_NOVELS
  };
};

export const fetchImg = novel_id => async (dispatch, getState) => {
  const images = getState()["images"];
  let existImgIds = [];
  for (var i = 0; i < images.length; i++) {
    existImgIds.push(images[i]["novel_id"]);
  }
  if (existImgIds.includes(novel_id)) {
    return undefined;
  }

  let axiosSets = {
    method: "post",
    url: "/api/img",
    data: {
      novel_id
    }
  };

  const res = await axios(axiosSets);
  dispatch({
    type: FETCH_IMG,
    payload: res.data
  });
};

export const fetchImgs = novelIds => async (dispatch, getState) => {
  const images = getState()["images"];
  let existImgIds = [];
  let willFetchImgIds = [];
  for (let i = 0; i < images.length; i++) {
    existImgIds.push(images[i]["novel_id"]);
  }

  for (let i = 0; i < novelIds.length; i++) {
    if (existImgIds.includes(novelIds[i])) {
      continue;
    }
    willFetchImgIds.push(novelIds[i]);
  }

  if (willFetchImgIds.length > 0) {
    let axiosSets = {
      method: "post",
      url: "/api/imgs",
      data: {
        willFetchImgIds
      }
    };

    const res = await axios(axiosSets);

    dispatch({
      type: FETCH_IMGS,
      payload: res.data
    });
  }
};
export const clearImg = () => {
  return {
    type: CLEAR_IMG
  };
};

export const fetchNovel = novel_id => async dispatch => {
  let axiosSets = {
    method: "post",
    url: "/api/novel",
    data: {
      novel_id
    }
  };

  const res = await axios(axiosSets);

  dispatch(addHotNovels([res.data]));
};

export const fetchCatalog = novel_id => async (dispatch, getState) => {
  const catalogs = getState()["catalog"];
  let existCatalogIds = [];

  for (let i = 0; i < catalogs.length; i++) {
    for (let id in catalogs[i]) {
      existCatalogIds.push(Number(id));
    }
  }

  if (existCatalogIds.includes(novel_id)) {
    // console.log("catalog exists no need refetching!");
    return undefined;
  }

  let axiosSets = {
    method: "post",
    url: "/api/catalog",
    data: {
      novel_id
    }
  };
  const res = await axios(axiosSets);
  dispatch({
    type: FETCH_CATALOG,
    payload: res.data
  });

  dispatch(saveCatalogLength(res.data[novel_id].length));
};

export const saveCatalogLength = catalogLength => {
  return {
    type: SAVE_CATALOG_LENGTH,
    payload: catalogLength
  };
};

export const clearCatalog = () => {
  return { type: CLEAR_CATALOG };
};

export const fetchChapterContent = chapterInfo => async dispatch => {
  let axiosSets = {
    method: "post",
    url: "/api/chapter",
    data: {
      chapterInfo
    }
  };

  const res = await axios(axiosSets);
  dispatch({
    type: FETCH_CHAPTER_CONTENT,
    payload: res.data
  });
};

export const fetchChaptersList = chapterInfo => async dispatch => {
  let axiosSets = {
    method: "post",
    url: "/api/chapters",
    data: {
      chapterInfo
    }
  };

  const res = await axios(axiosSets);

  const filteredResData = [];
  for (let i = 0; i < res.data.length; i++) {
    if (res.data[i]) {
      filteredResData.push(res.data[i]);
    }
  }

  dispatch({
    type: FETCH_CHAPTER_CONTENTS,
    payload: filteredResData
  });
};

export const clearChapterContent = () => {
  return {
    type: CLEAR_CHAPTER_CONTENT
  };
};

// ---------获取novel_name_table中的搜索结果
export const fetchSearchResult = keyword => async dispatch => {
  let axiosSets = {
    method: "post",
    url: "/api/search",
    data: {
      keyword
    }
  };

  const res = await axios(axiosSets);

  dispatch({
    type: FETCH_SEARCH_RESULT,
    payload: res.data
  });
};

export const clearSearchResult = () => {
  return {
    type: CLEAR_SEARCH_RESULT
  };
};
// ============刷新页面后数据从本地恢复

export const restoreHotNovels = hotNovels => {
  return {
    type: RESTORE_HOTNOVELS,
    payload: hotNovels
  };
};

export const restoreCatalog = catalog => {
  return {
    type: RESTORE_CATALOG,
    payload: catalog
  };
};

export const restoreChapters = chapters => {
  return {
    type: RESTORE_CHAPTERS,
    payload: chapters
  };
};

// 处理页码
export const saveCurrentPageIndex = index => {
  return {
    type: SAVE_CURRENT_PAGE_INDEX,
    payload: index
  };
};

export const savePageType = typeId => {
  return {
    type: SAVE_PAGE_TYPE,
    payload: typeId
  };
};

export const fetchRanklist = rankInfo => async (dispatch, getState) => {
  const { rankList } = getState();
  const existsRankIndex = [];
  for (let i = 0; i < rankList.length; i++) {
    for (let key in rankList[i]) {
      existsRankIndex.push(key);
    }
  }

  const axiosSets = {
    method: "post",
    url: "/api/rank",
    data: {
      rankInfo
    }
  };

  const res = await axios(axiosSets);
  const newData = [];
  for (let i = 0; i < res.data.length; i++) {
    if (existsRankIndex.includes(Object.keys(res.data[i])[0])) {
      continue;
    }
    newData.push(res.data[i]);
  }

  dispatch({
    type: FETCH_RANKLIST,
    payload: newData
  });

  const novels = [];

  for (let i = 0; i < newData.length; i++) {
    if (0 in newData[i]) {
      continue;
    }
    for (let key in newData[i]) {
      for (let j = 0; j < newData[i][key].length; j++) {
        novels.push(newData[i][key][j]);
      }
    }
  }

  dispatch(addHotNovels(novels));
};

export const clearRankinglist = () => {
  return {
    type: CLEAR_RANKING_LIST
  };
};

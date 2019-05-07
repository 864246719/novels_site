const mysqlCon = require("./mysqlConnector");

const weeklyNovels = async (req, res) => {
  const { genreIds } = req.body;

  // 从数据库获取分类小说列表，每分类一列表，多类合成一个列表
  statements = [];
  for (let i = 0; i < genreIds.length; i++) {
    let statement =
      "select * from novel_name_table where novel_genre=" +
      genreIds[i] +
      " order by novel_views_perweek  DESC limit 12";
    statements.push(statement);
  }
  let novelsResult = await mysqlCon.selectItems(statements);
  let newNovelsResult = [];
  for (let i = 0; i < novelsResult.length; i++) {
    let temp = [];
    for (let j = 0; j < novelsResult[i].length; j++) {
      tempDict = {
        novel_id: novelsResult[i][j]["novel_id"],
        novel_name: novelsResult[i][j]["novel_name"],
        novel_author: novelsResult[i][j]["novel_author"],
        novel_genre: novelsResult[i][j]["novel_genre"],
        novel_status: novelsResult[i][j]["novel_status"],
        novel_lastUpdate: novelsResult[i][j]["novel_lastUpdate"],
        novel_synopsis: novelsResult[i][j]["novel_synopsis"]
      };
      temp.push(tempDict);
    }
    newNovelsResult.push(temp);
  }

  let data = {
    novels: newNovelsResult
  };

  res.status(200).json(data);
};

module.exports.weeklyNovels = weeklyNovels;

const fetchImg = async (req, res) => {
  const { novel_id } = req.body;

  const condition = "where novel_id=" + novel_id;
  const result = await mysqlCon.selectItem("*", "cover_imgs", condition);

  res.status(200).json(result[0]);
};

module.exports.fetchImg = fetchImg;

const fetchImgs = async (req, res) => {
  const { willFetchImgIds } = req.body;
  const tableName = "cover_imgs";
  let condition = "where";

  for (let i = 0; i < willFetchImgIds.length; i++) {
    condition = condition + " novel_id=" + willFetchImgIds[i] + " OR";
  }
  condition = condition.slice(0, -2);
  const result = await mysqlCon.selectItem("*", "cover_imgs", condition);

  res.status(200).json(result);
};
module.exports.fetchImgs = fetchImgs;

const fetchNovel = async (req, res) => {
  const { novel_id } = req.body;
  const condition = "where novel_id=" + novel_id;
  const result = await mysqlCon.selectItem("*", "novel_name_table", condition);

  res.status(200).json(result[0]);
};

module.exports.fetchNovel = fetchNovel;

const fetchCatalog = async (req, res) => {
  const { novel_id } = req.body;
  const tableName = "catalog_" + novel_id;
  const result = await mysqlCon.selectItem("*", tableName);
  let newResult = {};
  newResult[novel_id] = result;
  res.status(200).json(newResult);
};

module.exports.fetchCatalog = fetchCatalog;

const fetchChapter = async (req, res) => {
  const { novel_id, novel_chapter_id } = req.body.chapterInfo;
  const tableName = "chapters_" + novel_id;
  const condition = "where novel_chapter_id=" + novel_chapter_id;
  const result = await mysqlCon.selectItem("*", tableName, condition);

  res.status(200).json(result[0]);
};

module.exports.fetchChapter = fetchChapter;

const fetchChapters = async (req, res) => {
  const { novel_id, chapterIds } = req.body.chapterInfo;

  let statements = [];
  for (let i = 0; i < chapterIds.length; i++) {
    let statement =
      "select * from chapters_" +
      novel_id +
      " where novel_chapter_id=" +
      chapterIds[i];
    statements.push(statement);
  }
  const result = await mysqlCon.selectItems(statements);

  let newRsult = result.map(each => each[0]);

  if (!result[0].length) {
    newRsult = result;
  }

  res.status(200).json(newRsult);
};

module.exports.fetchChapters = fetchChapters;

const fetchSearchResult = async (req, res) => {
  const { keyword } = req.body;
  const keywordString = keyword.replace(/\s\s+/g, " ");
  const keywordList = keywordString.split(" ");

  const tableName = "novel_name_table";
  let condition = "where ";
  for (let i = 0; i < keywordList.length; i++) {
    condition = condition + " novel_name like '%" + keywordList[i] + "%' OR";
  }

  condition = condition.slice(0, -2);

  const result = await mysqlCon.selectItem("*", tableName, condition);

  res.status(200).json(result);
};

module.exports.fetchSearchResult = fetchSearchResult;

const fetchSingleGenreNovels = async (req, res) => {
  const { genreId } = req.body;

  const tableName = "novel_name_table";
  const condition =
    "where novel_genre=" +
    genreId +
    " order by novel_views_permonth  DESC limit 72";

  const result = await mysqlCon.selectItem("*", tableName, condition);

  res.status(200).json(result);
};

module.exports.fetchSingleGenreNovels = fetchSingleGenreNovels;

const fetchRanklist = async (req, res) => {
  const { rank_type, currentPageIndex } = req.body.rankInfo;
  const tableName = "novel_name_table";
  const previewPageIndex = currentPageIndex - 1;
  const nextPageIndex = currentPageIndex + 1;
  const currentPoint = Number(currentPageIndex - 1 + "0") * 3;
  const previewPoint = Number(previewPageIndex - 1 + "0") * 3;
  const nextPoint = Number(nextPageIndex - 1 + "0") * 3;

  if (currentPageIndex === 1) {
    const conditions = [
      "SELECT TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA='novels' AND TABLE_NAME='novel_name_table'",
      "select * from novel_name_table order by " +
        rank_type +
        "  limit " +
        currentPoint +
        ",30",
      "select * from novel_name_table order by " +
        rank_type +
        "  limit " +
        nextPoint +
        ",30"
    ];

    const result = await mysqlCon.selectItems(conditions);

    const data = [{ 0: result[0][0] }, {}, {}];

    data[1][currentPageIndex] = result[1];
    data[2][nextPageIndex] = result[2];

    res.status(200).json(data);
  } else {
    const conditions = [
      "select * from novel_name_table order by " +
        rank_type +
        "  limit " +
        previewPoint +
        ",30",
      "select * from novel_name_table order by " +
        rank_type +
        "  limit " +
        currentPoint +
        ",30",
      "select * from novel_name_table order by " +
        rank_type +
        "  limit " +
        nextPoint +
        ",30"
    ];

    const result = await mysqlCon.selectItems(conditions);
    const data = [{}, {}, {}];

    data[0][previewPageIndex] = result[0];
    data[1][currentPageIndex] = result[1];
    data[2][nextPageIndex] = result[2];

    res.status(200).json(data);
  }
};

module.exports.fetchRanklist = fetchRanklist;

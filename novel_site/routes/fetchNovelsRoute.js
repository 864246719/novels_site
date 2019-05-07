const mysqlCon = require("../mysql/mysqlConnector");
const contentMysql = require("../mysql/contentMysql");

module.exports = app => {
  app.post("/api/weeklyNovels", (req, res) => {
    contentMysql.weeklyNovels(req, res);
  });

  app.post("/api/img", (req, res) => {
    contentMysql.fetchImg(req, res);
  });

  app.post("/api/imgs", (req, res) => {
    contentMysql.fetchImgs(req, res);
  });

  app.post("/api/novel", (req, res) => {
    contentMysql.fetchNovel(req, res);
  });

  app.post("/api/catalog", (req, res) => {
    contentMysql.fetchCatalog(req, res);
  });

  app.post("/api/chapter", (req, res) => {
    contentMysql.fetchChapter(req, res);
  });

  app.post("/api/chapters", (req, res) => {
    contentMysql.fetchChapters(req, res);
  });

  app.post("/api/search", (req, res) => {
    contentMysql.fetchSearchResult(req, res);
  });

  app.post("/api/genre", (req, res) => {
    contentMysql.fetchSingleGenreNovels(req, res);
  });

  app.post("/api/rank", (req, res) => {
    contentMysql.fetchRanklist(req, res);
  });
};

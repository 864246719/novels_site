const authMysql = require("../mysql/authMysql");
const mysqlCon = require("../mysql/mysqlConnector");
const keys = require("../config/keys");

const remainUserSession = async (req, res, next) => {
  const { userId } = req.session;
  if (userId) {
    let userInfo = await mysqlCon.selectItem(
      "*",
      "users",
      "where user_id=" + userId
    );
    const { user_id, user_name, user_nickname, user_email } = userInfo[0];
    res.locals.user = {
      user_id,
      user_name,
      user_nickname,
      user_email
    };
  }
  next();
};

module.exports = (app, SESSION_NAME) => {
  app.use(remainUserSession);

  app.post("/auth/login", (req, res) => {
    authMysql.login(req, res);
  });
  // 注册完成
  app.post("/auth/register", (req, res) => {
    authMysql.register(req, res);
  });

  app.post("/auth/logout", (req, res) => {
    req.session.destroy(err => {
      if (err) {
        console.log(err);
      }
      res.clearCookie(SESSION_NAME);
      res.status(200).json({ user_id: 0 });
    });
  });
};

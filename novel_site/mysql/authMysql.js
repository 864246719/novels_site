const mysqlCon = require("./mysqlConnector");

const register = async (req, res) => {
  const { username, email, password, nickname } = req.body.userInfo;
  const varNames = ["user_name", "user_passwd", "user_nickname", "user_email"];
  const values = [username, password, nickname, email];
  const result = await mysqlCon.insertItem("users", varNames, values);
  if (result) {
    const userId = result.insertId;
    let userInfo = await mysqlCon.selectItem(
      "*",
      "users",
      "where user_id = " + userId
    );
    req.session.userId = userInfo[0].user_id;
    const { user_id, user_name, user_nickname, user_email } = userInfo[0];
    const user = {
      user_id,
      user_name,
      user_nickname,
      user_email
    };
    res.status(200).json(user);
  } else {
    res.status(200).json({ user_id: 0 });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body.accountInfo;

  let condition =
    "where user_name='" + username + "'and user_passwd='" + password + "'";
  let result = await mysqlCon.selectItem("*", "users", condition);
  if (result[0]) {
    const { user_id, user_name, user_nickname, user_email } = result[0];
    req.session.userId = user_id;
    const user = {
      user_id,
      user_name,
      user_nickname,
      user_email
    };
    res.status(200).json(user);
  } else {
    res.status(200).json({ user_id: 0 });
  }
};

module.exports.register = register;
module.exports.login = login;

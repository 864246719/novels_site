const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const bodyParser = require("body-parser");

const keys = require("./config/keys");

const app = express();

const TWO_HOURS = 1000 * 60 * 60 * 2;
const {
  PORT = 8080,
  SESSION_LIFETIME = TWO_HOURS,
  SESSION_NAME = "sid",
  NODE_ENV = "development"
} = process.env;
const IN_PROD = NODE_ENV === "production";

const sessionStore = new MySQLStore(keys.MySQLStoreOptions);

// serve 前端
app.use(express.static(`${__dirname}/client/build`));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

console.log("IN_PROD:", IN_PROD);

app.use(
  session({
    name: SESSION_NAME,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    secret: keys.cookieKey,
    cookie: {
      maxAge: SESSION_LIFETIME,
      sameSite: true,
      secure: IN_PROD
    }
  })
);

// Authentication相关
require("./routes/authRoute")(app, SESSION_NAME);

// 获取小说内容相关
require("./routes/fetchNovelsRoute")(app);

app.get("/auth", (req, res) => {
  console.log(req.session);
  res.send("hello");
});

app.get("^/novels/:novelId([0-9]{1,10})", (req, res) => {
  res.send("novels category");
  console.log(req.params.novelId);
});

app.get(
  "^/novels/:novelId([0-9]{1,10})/:chapterId([0-9]{1,10})",
  (req, res) => {
    res.send("chapter");
    console.log(req.params.chapterId);
  }
);

app.get("^/novels/:novelId([0-9]{1,10})/coverimg", (req, res) => {
  res.send("coverImg");
  console.log(req.params.novelId);
});

//serve 前端
const path = require("path");
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});

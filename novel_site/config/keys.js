if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
  console.log("production mode !");
} else {
  module.exports = require("./dev");
  console.log("development mode !");
}

module.exports = {
  cookieKey: process.env.COOKIE_KEY,
  MySQLStoreOptions: {
    host: "localhost",
    port: "3306",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME
  },
  MySQLConnectionSets: {
    host: "localhost",
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWD,
    database: process.env.DB_NAME,
    multipleStatements: true
  }
};

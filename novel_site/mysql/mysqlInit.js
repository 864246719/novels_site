const mysql = require("./mysqlConnector");

const usersTableSettings = [
  ["user_id", "INT NOT NULL AUTO_INCREMENT PRIMARY KEY"],
  ["user_name", "VARCHAR(255) not null unique"],
  ["user_passwd", "VARCHAR(255) not null"],
  ["user_nickname", "VARCHAR(255) not null unique"],
  ["user_email", "VARCHAR(255) NOT NULL unique"],
  ["dt_created", "datetime DEFAULT CURRENT_TIMESTAMP"],
  [
    "dt_modified",
    "datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  ]
];
mysql.createTable("users", usersTableSettings);

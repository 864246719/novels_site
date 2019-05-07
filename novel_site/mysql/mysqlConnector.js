const mysql = require("mysql");
const keys = require("../config/keys");

const dbName = "novels";

const con = mysql.createConnection(keys.MySQLConnectionSets);
con.connect(function(err) {
  if (err) throw err;
});

// 检查数据库是否存在 存在返回1，不存在返回0
function _checkDBExists(databaseName) {
  return new Promise(function(resolve, reject) {
    let sql = "SHOW DATABASES";
    con.query(sql, function(err, result) {
      if (err) throw err;
      for (let i = 0; i < result.length; i++) {
        if (result[i]["Database"] === databaseName) {
          resolve(1);
        }
      }
      resolve(0);
    });
  });
}

const checkDBExists = async function(databaseName = dbName) {
  let result = await _checkDBExists(databaseName);
  return result;
};

module.exports.checkDBExists = checkDBExists;

// 创建数据库
const createDB = async function(databaseName = dbName) {
  const isDBexists = await checkDBExists(databaseName);
  if (!isDBexists) {
    let sql =
      "CREATE DATABASE " +
      databaseName +
      " CHARACTER SET utf8 COLLATE utf8_unicode_ci";

    con.query(sql, function(err) {
      if (err) throw err;
    });
  }
};
module.exports.createDB = createDB;

// ============================================create Table=======================================
// 用于创建table,参数tableSetTupleList格式为[['novel_id','MEDIUMINT PRIMARY KEY'],['novel_views_perday','INT'],['novel_synopsis','TEXT(65535)']]

const createTable = function(tableName, tableSetTupleList) {
  let tableSetString = "";
  tableSetTupleList.map(function(each) {
    tableSetString = tableSetString + each[0] + " " + each[1] + ",";
  });
  tableSetString = tableSetString.slice(0, tableSetString.length - 1);
  let sql = "CREATE TABLE " + tableName + " (" + tableSetString + ")";
  con.query(sql, function(err) {
    if (err) throw err;
  });
};

module.exports.createTable = createTable;
//  =============================================增===============================================
//  为table增加条目，varNames为列表类型，values为值
function _insertItem(tableName, varNames, values) {
  return new Promise(function(resolve, reject) {
    let varString = "";
    let multipleRows = [values];
    for (let i = 0; i < varNames.length; i++) {
      varString = varString + varNames[i] + ",";
    }
    varString = varString.slice(0, -1);

    sql = "INSERT INTO " + tableName + " (" + varString + ") VALUES  ?";
    con.query(sql, [multipleRows], function(err, result) {
      if (err) {
        console.log(err);
      }
      resolve(result);
    });
  });
}
const insertItem = async function(tableName, varNames, values) {
  let result = await _insertItem(tableName, varNames, values);
  return result;
};

module.exports.insertItem = insertItem;
// ==========================================Delete====================================================
//  sql = "DELETE FROM " + tableName +" WHERE " +conditions
const delItem = function(tableName, conditions) {
  let sql = "DELETE FROM " + tableName + " WHERE " + conditions;
  con.query(sql, function(err) {
    if (err) throw err;
  });
};

module.exports.delItem = delItem;
// ===========================================UPDATE=========================================
// sql = "UPDATE "+tableName+" SET " + newValuePair + " WHERE " + location
const updateItem = function(tableName, newValuePair, location) {
  let sql =
    "UPDATE " + tableName + " SET " + newValuePair + " WHERE " + location;
  con.query(sql, function(err) {
    if (err) throw err;
  });
};

module.exports.updateItem = updateItem;

//  ===========================================SELECT==========================================
function _selectItem(keys, tableName, condition) {
  return new Promise(function(resolve, reject) {
    let sql = "SELECT " + keys + " FROM " + tableName + " " + condition;
    con.query(sql, function(err, result) {
      if (err) throw err;
      resolve(result);
    });
  });
}
const selectItem = async function(keys, tableName, condition = "") {
  let result = await _selectItem(keys, tableName, condition);
  return result;
};

module.exports.selectItem = selectItem;

//  ==========多语句 SELECT==========================================
function _selectItems(statements) {
  return new Promise(function(resolve, reject) {
    let sql = "";
    for (let i = 0; i < statements.length; i++) {
      sql = sql + statements[i] + ";";
    }
    con.query(sql, function(err, result) {
      if (err) throw err;
      resolve(result);
    });
  });
}
const selectItems = async function(statements = "") {
  let result = await _selectItems(statements);
  return result;
};

module.exports.selectItems = selectItems;

// ==================================测试用代码
// 1.测试createTable()
// const novelNameTableSettings = [
//   ["novel_id", "MEDIUMINT PRIMARY KEY"],
//   ["novel_name", "VARCHAR(255)"],
//   ["novel_name_pinyin", "VARCHAR(255)"],
//   ["novel_author", "VARCHAR(255)"],
//   ["novel_genre", "VARCHAR(255)"],
//   ["novel_recent_update", "DATE"],
//   ["novel_synopsis", "TEXT(65535)"],
//   ["novel_views_perday", "INT"],
//   ["novel_views_perweek", "INT"],
//   ["novel_views_permonth", "INT"],
//   ["novel_views_total", "INT"]
// ];
// createTable("test", novelNameTableSettings);

// 2.增
// const varNames = ["novel_id", "novel_name", "novel_author"];
// const values = [3, "神墓", "陈东"];
// insertItem("test", varNames, values);

// 3.删
// delItem("test", "novel_id = 3");

// 4.改
// updateItem("test", "novel_name = '无双天'", "novel_id = 3");

// 5.查  返回：包含对象的列表
// async function testSelect() {
//   let result = await selectItem("*", "test");
//   console.log(result[0]["novel_id"]);
// }
// testSelect();

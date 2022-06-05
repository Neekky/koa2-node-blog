const mysql = require("mysql");
const { MYSQL_CONF } = require("../conf/db");

const con = mysql.createConnection(MYSQL_CONF);

con.connect();

// 统一执行sql函数
function exec(sql) {
  return new Promise((res, rej) => {
    con.query(sql, (err, result) => {
      if (err) {
        rej(err);
        return;
      }
      res(result);
    });
  });
}

module.exports = {
  exec,
  escape: mysql.escape
};

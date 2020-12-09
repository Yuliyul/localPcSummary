const mysql = require("mysql");
const db_settings = require("../config");

module.exports.getConnection = function getConnection() {
  return new Promise((resolve, reject) => {
    process.ffVersion = "74.21";
    try {
      const connection = mysql.createConnection(db_settings.db_settings);
      connection.connect((error) => {
        if (error) {
          console.log("HERE");
          console.error(error.message || error.stack);
          reject(error);
        }

        resolve(connection);
      });
    } catch (error) {
      console.error(error.message || error.stack);
      reject(error);
    }
  });
};

module.exports.getMysqlVersion = function (connection) {
  return new Promise((resolve, reject) => {
    connection.query("SELECT VERSION() as v;", (error, results, fields) => {
      if (error) {
        console.error(error.message || error.stack);
        reject(error);
      }

      console.log(results[0].v);
      resolve(results[0].v);
    });
  });
};

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "webskmysql.mysql.database.azure.com",
  user: "webskadmin@webskmysql",
  password: "omani123!",
  database: "websk",
  port: 3306
});

connection.connect(err => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("MySql connected");
});

module.exports = connection;

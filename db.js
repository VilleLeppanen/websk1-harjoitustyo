const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "",
  user: "",
  password: "",
  database: "",
  port: 
});

connection.connect(err => {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("MySql connected");
});

module.exports = connection;

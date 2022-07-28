const mysql = require("mysql");

var connection = mysql.createPool({
  host: "us-cdbr-east-06.cleardb.net",
  user: "b04de111477867",
  password: "c8d5a5a2",
  database: "heroku_a3f3a29d033fce4"
});

module.exports = connection;
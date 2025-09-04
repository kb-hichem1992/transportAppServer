const mysql = require("mysql2");
const config = require("./config");

// Shared MySQL pool used across routers
const db = mysql.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  dateStrings: config.database.dateStrings
});
module.exports = db;



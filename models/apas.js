const sqlite3 = require("sqlite3").verbose();
const { Database } = require("@sqlitecloud/drivers");
const dotenv = require("dotenv");
dotenv.config();
const apikey = process.env.SQLITECLOUD;
const db = new Database(
  "sqlitecloud://cijmwjfdhz.g2.sqlite.cloud:8860/apas.db?apikey=" + apikey
);
module.exports = db;

// const sqlite3 = require("sqlite3").verbose();
// let db = new sqlite3.Database("./db/apas.db", (err) => {
//   if (err) {
//     console.log("DB connection ERROR.");
//     console.error(err.message);
//   }
//   console.log("DB connection OK.");
// });
// module.exports = db;

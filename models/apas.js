// const sqlite3 = require("sqlite3").verbose();
// const { Database } = require('@sqlitecloud/drivers');
// const connectionString = 'sqlitecloud://chbjkzyihk.sqlite.cloud:8860/apas?apikey=ZUo3zLgRLtXRESBYsKHX557Nrq1wdHyDaKnfLkBmGyg';
// let db = new sqlite3.Database(connectionString, (err) => {
//   if (err) {
//     console.log("DB connection ERROR.");
//     console.error(err.message);
//   }
//   console.log("DB connection OK.");
// });
// module.exports = db;

const sqlite3 = require("sqlite3").verbose();
let db = new sqlite3.Database("./db/apas.db", (err) => {
  if (err) {
    console.log("DB connection ERROR.");
    console.error(err.message);
  }
  console.log("DB connection OK.");
});
module.exports = db;

const express = require("express");
const router = express.Router();
const db = require("../models/apas");
const fs = require("fs");
const path = require("path");
const queriesToExport = require("./queriesListsToExport");
const queriesCustom = require("./queriesCustom");
const utils = require("./utils");

router.get("/getExpAct18/:year/:month/:orderValue", (req, res) => {
  const { year } = req.params;
  const { month } = req.params;
  const { orderValue } = req.params;

  let q = queriesCustom.getExpAct18(year, month, orderValue);
  let query = q.query;
  console.log(query);

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }

    let response = {
      total: 0,
      result: rows,
      totalPages: 0,
      currentPage: 0,
    };

    res.send(response);
  });
});

router.get(
  "/getResumenInt18/:contribuyente/:year/:month/:day/:orderValue",
  (req, res) => {
    const { contribuyente } = req.params;
    const { year } = req.params;
    const { month } = req.params;
    const { day } = req.params;
    const { orderValue } = req.params;

    let q = queriesCustom.getResumenInt18(
      contribuyente,
      year,
      month,
      day,
      orderValue
    );
    let query = q.query;
    console.log(query);

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: err.message });
      }

      let response = {
        total: 0,
        result: rows,
        totalPages: 0,
        currentPage: 0,
      };

      res.send(response);
    });
  }
);

router.get("/getRelacionByActo/:acto", (req, res) => {
  const { acto } = req.params;
  let q = queriesCustom.getRelacionByActo(acto);
  let query = q.query;
  console.log(query);

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }
    res.send(rows);
  });
});

router.get("/:table/paginated/:page/:pageSize/:orderValue", (req, res) => {
  const { page } = req.params;
  const { table } = req.params;
  const { pageSize } = req.params;
  const { orderValue } = req.params;
  if (!orderValue) {
    orderValue = "ID";
  }
  const resultPerPage = pageSize;
  const offset = (page ? page : 1 - 1) * resultPerPage;
  const query =
    `SELECT * FROM ` + table + ` ORDER BY ` + orderValue + ` ASC LIMIT ?,?`;
  const queryCount = `SELECT count(*) FROM ` + table;
  console.log(query, offset, resultPerPage);
  db.all(query, [offset, resultPerPage], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }

    let response = {
      total: 0,
      result: rows,
      totalPages: 0,
      currentPage: page,
    };

    db.all(queryCount, [], (err2, rows2) => {
      if (err2) {
        console.error(err2.message);
        return res.status(500).json({ message: err2.message });
      }
      let count = rows2[0]["count(*)"];
      response.total = count;
      response.totalPages = Math.round(count / resultPerPage) + 1;
      res.send(response);
    });
  });
});

router.get(
  "/:table/paginated/:page/:pageSize/:searchProp/:searchValue/:orderValue",
  (req, res) => {
    const { page } = req.params;
    const { table } = req.params;
    const { pageSize } = req.params;
    const { searchProp } = req.params;
    const { searchValue } = req.params;
    const { orderValue } = req.params;
    if (!orderValue) {
      orderValue = "ID";
    }
    const resultPerPage = pageSize;
    const offset = (page ? page : 1 - 1) * resultPerPage;
    let query = "";
    let queryCount = "";
    if (searchProp === "FRETENCION") {
      let q = queriesCustom.getLotesByFRetencion(searchValue, orderValue);
      query = q.query;
      queryCount = q.queryCount;
    } else {
      query =
        `SELECT * FROM ` +
        table +
        ` WHERE ` +
        searchProp +
        ` LIKE '%` +
        searchValue +
        `%' ORDER BY ` +
        orderValue +
        ` ASC LIMIT ?,?`;
      queryCount =
        `SELECT count(*) FROM ` +
        table +
        ` WHERE ` +
        searchProp +
        ` LIKE '%` +
        searchValue +
        `%'`;
    }

    console.log(query);
    db.all(query, [offset, resultPerPage], (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ message: err.message });
      }

      let response = {
        total: 0,
        result: rows,
        totalPages: 0,
        currentPage: page,
      };

      db.all(queryCount, [], (err2, rows2) => {
        if (err2) {
          console.error(err2.message);
          return res.status(500).json({ message: err2.message });
        }
        let count = rows2[0]["count(*)"];
        response.total = count;
        response.totalPages = Math.round(count / resultPerPage) + 1;
        res.send(response);
      });
    });
  }
);

router.get("/:table/:id", (req, res) => {
  const { id } = req.params;
  const { table } = req.params;

  const query = `SELECT * FROM ` + table + ` WHERE ID = ?`;

  db.all(query, [id], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }

    res.send(rows[0]);
  });
});

router.delete("/:table/:id", (req, res) => {
  const { id } = req.params;
  const { table } = req.params;

  const query = `DELETE FROM ` + table + ` WHERE ID = ?`;

  db.run(query, [id], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }

    res.send({ response: this.changes });
  });
});

router.post("/:table/add", (req, res) => {
  const { table } = req.params;
  const propertiesArray = Object.keys(req.body);
  const commaSeparatedStringProps = propertiesArray.join();
  const commaSeparatedStringValues = [];
  for (const propiedad in req.body) {
    const valor = req.body[propiedad];
    if (
      typeof valor === null ||
      typeof valor === undefined ||
      typeof valor === "object"
    ) {
      commaSeparatedStringValues.push("null");
    } else if (typeof valor === "string") {
      commaSeparatedStringValues.push(`'${valor}'`);
    } else {
      commaSeparatedStringValues.push(valor);
    }
  }

  const query =
    `INSERT INTO ` +
    table +
    ` (` +
    commaSeparatedStringProps +
    `) VALUES(` +
    commaSeparatedStringValues +
    `)`;

  console.log(query);

  db.run(query, [], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }

    res.send({ result: "ok" });
  });
});

router.delete("/cesionario/:id", (req, res) => {
  const bookId = req.params.id;
  const q = "DELETE FROM Cesionario WHERE ID=?";

  db.query(q, [bookId], (err, data) => {
    if (err) return res.json(err);
    return res.json("Cesionario has been deleted.");
  });
});

router.put("/:table/edit/:id", (req, res) => {
  const { table } = req.params;
  const { id } = req.params;
  const propertyStrings = [];
  console.log(req.body);
  for (const property in req.body) {
    if (property != "ID") {
      if (typeof req.body[property] === "string") {
        propertyStrings.push(`'${property}'='${req.body[property]}'`);
      } else {
        propertyStrings.push(`'${property}'=${req.body[property]}`);
      }
    }
  }
  const updateStr = propertyStrings.join(", ");

  const query = `UPDATE ` + table + ` SET ` + updateStr + ` WHERE ID =` + id;

  console.log(query);

  db.run(query, [], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }

    res.send({ result: "ok" });
  });
});

router.get("/backup", (req, res) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // Months are 0-indexed
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const formattedDate = `${day.toString().padStart(2, "0")}${month
    .toString()
    .padStart(2, "0")}${year}`;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  const sourceFile = "../db/apas.db";
  const destinationFile = `../db/apas_backup_` + formattedDate + `.db`;
  const sourcePath = path.join(__dirname, sourceFile);
  const destinationPath = path.join(__dirname, destinationFile);

  fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }
    console.log("File copied successfully!");
    res.send(formattedDate);
  });
});

router.put("/:table/updateBackupDate/:id/:date", (req, res) => {
  const { table } = req.params;
  const { id } = req.params;
  const { date } = req.params;

  const query =
    `UPDATE ` + table + ` SET Backup = ` + date + ` WHERE ID =` + id;

  console.log(query);

  db.run(query, [], function (err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }

    res.send({ result: "ok" });
  });
});

router.get("/:table/last/:valueToCalc", (req, res) => {
  const { table } = req.params;
  const { valueToCalc } = req.params;
  const query =
    `SELECT * FROM ` + table + ` ORDER BY ` + valueToCalc + ` DESC LIMIT 1;`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }

    res.send(rows[0]);
  });
});

router.post("/listsToExport", (req, res) => {
  const {
    id,
    table,
    page,
    pageSize,
    orderValue,
    dateFecVen,
    monthListInhFecha,
    yearListInhFecha,
    mante,
  } = req.body;
  if (!orderValue) {
    orderValue = "ID";
  }
  const resultPerPage = pageSize;
  const offset = (page ? page : 1 - 1) * resultPerPage;
  let query = "";
  let queryCount = "";
  let q = null;
  switch (id) {
    case "ListSepVencidas":
      let dListSepVencidas = utils.parseDateToQuery(
        dateFecVen ? dateFecVen : "01/01/1990"
      );
      q = queriesToExport.ListSepVencidas(table, dListSepVencidas, orderValue);
      query = q.query;
      queryCount = q.queryCount;
      break;
    case "ListNicMonth":
      let mListNicMonth = utils.getCurrentMonthYear();
      q = queriesToExport.ListNicMonth(table, orderValue, mListNicMonth);
      query = q.query;
      queryCount = q.queryCount;
      break;
    default:
      return res.status(500).json({ message: "error db query" });
  }

  console.log(query);
  db.all(query, [offset, resultPerPage], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ message: err.message });
    }

    let response = {
      total: 0,
      result: rows,
      totalPages: 0,
      currentPage: page,
    };

    db.all(queryCount, [], (err2, rows2) => {
      if (err2) {
        console.error(err2.message);
        return res.status(500).json({ message: err2.message });
      }
      let count = rows2[0]["count(*)"];
      response.total = count;
      response.totalPages = Math.round(count / resultPerPage) + 1;
      res.send(response);
    });
  });
});

module.exports = router;

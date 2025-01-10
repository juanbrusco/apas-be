const ListNicMonth = (table, orderValue, monthYear) => {
  let query =
    `SELECT * FROM ` +
    table +
    ` WHERE SUBSTR(FecVen, 7, 4) || SUBSTR(FecVen, 4, 2) = '` +
    monthYear +
    `' ORDER BY ` +
    orderValue +
    ` ASC LIMIT ?,?`;
  let queryCount =
    `SELECT count(*) FROM ` +
    table +
    ` WHERE SUBSTR(FecVen, 7, 4) || SUBSTR(FecVen, 4, 2) = '` +
    monthYear +
    `'`;

  return { query: query, queryCount: queryCount };
};

module.exports = {
  ListNicMonth,
};

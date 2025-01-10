const getRelacionByActo = (acto) => {
  let query =
    ` SELECT RELACION_ROLES_ACTOS.ID_ROL, RELACION_ROLES_ACTOS.ID_ACTO, ROLES_ER.RELACION, ROLES_ER.DESCRIPCION1, ROLES_ER.DESCRIPCION2 FROM ROLES_ER INNER JOIN RELACION_ROLES_ACTOS ON ROLES_ER.ID = RELACION_ROLES_ACTOS.ID_ROL Where RELACION_ROLES_ACTOS.ID_ACTO = (select id from ACTOS_ER where ACTO = '` +
    acto +
    `')`;
  return { query: query };
};

const getResumenInt18 = (contribuyente, year, month, day, orderValue) => {
  let q;
  if (contribuyente != "*" && year != "*" && month != "*" && day != "*") {
    q =
      ` CONTRIBUYENTE = '` +
      contribuyente +
      `' AND strftime('%Y', FRETENCION) = '` +
      year +
      `' AND strftime('%m', FRETENCION) = '` +
      month +
      `' AND strftime('%d', FRETENCION) = '` +
      day +
      `'`;
  } else if (year != "*" && month != "*" && day != "*") {
    q =
      ` strftime('%Y', FRETENCION) = '` +
      year +
      `' AND strftime('%m', FRETENCION) = '` +
      month +
      `' AND strftime('%d', FRETENCION) = '` +
      day +
      `'`;
  } else if (contribuyente != "*" && year != "*" && month != "*") {
    q =
      ` CONTRIBUYENTE = '` +
      contribuyente +
      `' AND strftime('%Y', FRETENCION) = '` +
      year +
      `' AND strftime('%m', FRETENCION) = '` +
      month +
      `'`;
  } else if (year != "*" && month != "*") {
    q =
      `strftime('%Y', FRETENCION) = '` +
      year +
      `' AND strftime('%m', FRETENCION) = '` +
      month +
      `'`;
  } else if (contribuyente != "*" && year != "*") {
    q =
      ` CONTRIBUYENTE = '` +
      contribuyente +
      `' AND strftime('%Y', FRETENCION) = '` +
      year +
      `'`;
  } else if (year != "*") {
    q = `strftime('%Y', FRETENCION) = '` + year + `'`;
  } else if (contribuyente != "*") {
    q = ` CONTRIBUYENTE = '` + contribuyente + `'`;
  } else {
    q = " FRETENCION IS NOT NULL";
  }

  let query =
    `SELECT ID,CONTRATO,FCONTRATO,FRETENCION,BASE,ALICUOTA,CONTRIBUYENTE,RAZON,SELLADO,DERECHO,ROL
    FROM LOTES 
    WHERE ` +
    q +
    ` ORDER BY ` +
    orderValue +
    ` ASC`;
  return { query: query };
};

const getLotesByFRetencion = (fRetencion, orderValue) => {
  let q;
  const [year, month, day] = fRetencion.split("-");
  if (year != "*" && month != "*" && day != "*") {
    q =
      ` strftime('%Y', FRETENCION) = '` +
      year +
      `' AND strftime('%m', FRETENCION) = '` +
      month +
      `' AND strftime('%d', FRETENCION) = '` +
      day +
      `'`;
  } else if (year != "*" && month != "*") {
    q =
      `strftime('%Y', FRETENCION) = '` +
      year +
      `' AND strftime('%m', FRETENCION) = '` +
      month +
      `'`;
  } else if (year != "*") {
    q = `strftime('%Y', FRETENCION) = '` + year + `'`;
  } else {
    q = " FRETENCION IS NOT NULL";
  }

  let query =
    `SELECT * FROM LOTES WHERE ` +
    q +
    ` ORDER BY ` +
    orderValue +
    ` ASC LIMIT ?,?`;
  let queryCount = `SELECT count(*) FROM LOTES WHERE ` + q;
  return { query: query, queryCount: queryCount };
};

const getExpAct18 = (year, month, orderValue) => {
  let q;
  if (year != "*" && month != "*") {
    q =
      `strftime('%Y', FRETENCION) = '` +
      year +
      `' AND strftime('%m', FRETENCION) = '` +
      month +
      `'`;
  } else if (year != "*") {
    q = `strftime('%Y', FRETENCION) = '` + year + `'`;
  } else {
    q = " FRETENCION IS NOT NULL";
  }

  let query =
    `SELECT * FROM LOTES 
    WHERE ` +
    q +
    ` ORDER BY ` +
    orderValue +
    ` ASC`;
  return { query: query };
};

module.exports = {
  getRelacionByActo,
  getResumenInt18,
  getExpAct18,
  getLotesByFRetencion,
};

const parseDateToQuery = (dateString) => {
  const dateParts = dateString.split("/");
  const day = dateParts[0].padStart(2, "0");
  const month = dateParts[1].padStart(2, "0");
  const year = dateParts[2];
  return `${year}${month}${day}`;
};

const getCurrentMonthYear = () => {
  const d = new Date();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();
  return `${year}${month}`;
};

module.exports = {
  parseDateToQuery,
  getCurrentMonthYear,
};

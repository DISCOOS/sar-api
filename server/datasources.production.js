module.exports = {
  db: {
    url: process.env.DATABASE_URL + '?encoding=utf8&collation=utf8_general_ci',
    name: "postgresql",
    connector: "postgresql"
  }
};

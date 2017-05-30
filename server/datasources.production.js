module.exports = {
  postgresql: {
    url: process.env.DATABASE_URL + '?encoding=utf8&collation=utf8_general_ci',
    name: "postgresql",
    connector: "postgresql"
  },
  mysql: {
    url: process.env.CLEARDB_DATABASE_URL,
    name: "mysql",
    connector: "mysql"
  }
};  

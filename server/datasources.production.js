module.exports = {
  postgresql: {
    url: process.env.DATABASE_URL,
    name: "postgresql",
    connector: "postgresql"
  },
  mysql: {
    url: process.env.MYSQL_URL,
    name: "mysql",
    connector: "mysql"
  }
};  

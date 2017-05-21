module.exports = {
  mysql: {

    host: process.env.MYSQL_HOST || 'localhost',
    database: process.env.MYSQL_DB || 'sar',
    port: process.env.MYSQL_PORT || 8889,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PW || 'root',
    url: "",
    name: "mysql",
    connector: "mysql"
  }
};
const mysql = require('mysql');

const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Ashwin123$',
  database: 'yelp_schema',
  connectionLimit: 10,
});

module.exports = mysqlPool;

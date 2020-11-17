const mysql = require('mysql');

const mysqlconnection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ashwin123$',
  database: 'yelp_schema',
});

mysqlconnection.connect((err) => {
  if (err) {
    console.error('error connecting: ', err);
    return;
  }
  console.log('My Sql Connection made with id ', mysqlconnection.threadId);
});

module.exports = mysqlconnection;

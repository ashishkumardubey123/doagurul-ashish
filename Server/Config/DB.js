const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydoaguru_letters'
});

connection.connect((err) => {
  if (err) {
    console.error('Here DB ERROR:', err);
    return;
  } else {
    console.log('YES DB Connected (*_*) DB-Name>>>>>:', connection.config.database);
  }
});

module.exports = connection;

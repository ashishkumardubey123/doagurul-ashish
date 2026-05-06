const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'mydoaguru_letters',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test connection on startup
pool.getConnection()
  .then(connection => {
    console.log('YES DB Connected (*_*) DB-Name>>>>>', connection.config.database);
    connection.release();
  })
  .catch(err => {
    console.error('Here DB ERROR:', err);
  });

module.exports = pool;

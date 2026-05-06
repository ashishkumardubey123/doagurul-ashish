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

// Connection test
pool.getConnection()
  .then(conn => {
    console.log('YES DB Connected (*_*) DB-Name>>>>>', conn.config.database);
    conn.release();
  })
  .catch(err => {
    console.error('Here DB ERROR:', err);
  });

module.exports = pool;

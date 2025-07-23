const { Pool } = require('pg');

const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'mydb',
  password: '1234',
  port: 5432, 
});

pool.on('connect', () => {
  console.log(' Connected to PostgreSQL');
});

module.exports = pool;

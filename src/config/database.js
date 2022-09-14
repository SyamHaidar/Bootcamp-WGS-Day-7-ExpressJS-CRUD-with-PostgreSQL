const Pool = require('pg').Pool

const db = new Pool({
  user: 'postgres',
  password: 'SyamHaidar',
  database: 'postgres',
  host: 'localhost',
  port: 5432,
})

module.exports = db

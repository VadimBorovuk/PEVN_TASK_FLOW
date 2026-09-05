require('dotenv').config();

const Pool = require('pg').Pool

//For connection local database by PgAdmin
// const pool = new Pool({
//   user: process.env.POSTGRES_USER,
//   password: 'root',
//   host: 'localhost',
//   port: 5432,
//   database: process.env.POSTGRES_DB_NAME
// })

//For connection cloud database by Neon
const pool = new Pool({
 connectionString: process.env.DATABASE_URL_PS,
  ssl: process.env.NODE_ENV ==='production' ? {
    rejectUnauthorized: false
  }: false,
})


module.exports = pool;

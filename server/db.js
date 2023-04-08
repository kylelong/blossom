const Pool = require("pg").Pool;
const dev = new Pool({
  user: "kylelong",
  password: "",
  host: "localhost",
  port: 5432,
  database: "blossom",
});

const prod = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});
const pool = process.env.NODE_ENV === "production" ? prod : dev;
module.exports = pool;

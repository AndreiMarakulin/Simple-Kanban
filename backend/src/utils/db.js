require("dotenv").config();

/**
 * Доступ к БД.
 * @type {import('knex').Knex<any, unknown[]>}
 */
const db = require("knex")({
  client: "postgresql",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

module.exports = db;
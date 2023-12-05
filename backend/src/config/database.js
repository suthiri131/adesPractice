
const config = require("./config");
const pg = require("pg");

const pool = new pg.Pool({
  user: config.user,
  password: config.password,
  host: config.host,
  database: config.database,
  max: config.connectionLimit,
  port:config.port,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Monkey patch .query(...) method to console log all queries before executing it
// For debugging purpose
const oldQuery = pool.query;
pool.query = function (...args) {
  const [sql, params] = args;
  console.log(`EXECUTING QUERY |`, sql, params);
  return oldQuery.apply(pool, args);
};

module.exports = pool;

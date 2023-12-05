const dotenv = require("dotenv");
const path = require("path");
dotenv.config();
module.exports = {
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  port: process.env.DB_PORT,
  secretKey: process.env.SECRET_KEY_API,
  email: process.env.WEBSITE_EMAIL,
  emailPwd: process.env.EMAIL_PASSWORD,
};

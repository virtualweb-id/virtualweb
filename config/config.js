const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') require('dotenv').config();
const uppercasedEnv = env.toUpperCase();


const username = process.env['DB_USERNAME_' + uppercasedEnv]
const password = process.env['DB_PASSWORD_' + uppercasedEnv]
const host = process.env['DB_HOST_' + uppercasedEnv]
const dialect = process.env['DB_DIALECT_' + uppercasedEnv]

module.exports = {
  "development": {
    username,
    password,
    "database": "virtualwed",
    host,
    dialect
  },
  "test": {
    username,
    password,
    "database": "virtualwed_test",
    host,
    dialect
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}

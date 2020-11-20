const Sequelize = require('sequelize')
require('dotenv/config')

console.log("TESTE DOTENV" + process.env.HOST);

// connecta com a base de dados mysql
const connection = new Sequelize(process.env.DATABASE, process.env.USER_NAME, process.env.PASSWORD, {
  host: process.env.HOST,
  dialect: 'mysql',
  port: process.env.DATABASE_PORT,
})

module.exports = connection
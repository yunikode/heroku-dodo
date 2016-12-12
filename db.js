const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'

const sequelize

if (env === 'production') {
  sequelize = new Sequelize(process.env.DATABSE_URL, {
    dialect: 'postgres'
  })
} else {
  sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite'
  }
}

const db = {}

db.todo = sequelize.import( __dirname + '/models/todo.js')
db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db

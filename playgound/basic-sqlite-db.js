const Sequelize = require('sequelize')
const sequelize = new Sequelize(undefined, undefined, undefined, {
  'dialect': 'sqlite',
  'storage': __dirname + '/basic-sqlite-db.sqlite'
})

const Todo = sequelize.define('todo', {
  description: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: [1, 250]
    }
  },
  completed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
})

sequelize.sync().then( () => {
  console.log('Everything is synced')

  Todo.create({
    description: '',
    completed: false
  }).then( (todo) => {
    return Todo.create({
      description: 'Clean office'
    })
  }).then( () => { return Todo.findById(1)}
  ).catch( (e) => console.error(e.message)  )
})

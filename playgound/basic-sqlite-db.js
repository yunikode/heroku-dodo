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

  Todo.findById(1)
    .then( todo => {
      todo
      ? console.log(todo.toJSON())
      : console.log('todo not found')
    })
    .catch( e => console.log(e.message))

  // Todo.create({
  //   description: 'Walk the cat',
  //   completed: false
  // }).then( (todo) => {
  //   return Todo.create({
  //     description: 'Clean office'
  //   })
  // // }).then( () => { return Todo.findById(1)}
  // }).then( () => { return Todo.findAll({
  //   where: {
  //     description: {
  //       $like: '%cat%'
  //     }
  //   }
  // }) }
  // ).then( todos => {
  //   todos ? todos.forEach( todo => console.log(todo.toJSON())) : console.log('no todos found')
  // })
  // .catch( (e) => console.error(e.message)  )
})

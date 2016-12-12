const express = require('express')
const bodyParser = require('body-parser')
const _ = require('underscore')

const db = require('./db')

const app = express()

const PORT = process.env.PORT || 3000

let todos = []
let todoNextId = 1

app.use(bodyParser.json())

// GET

app.get('/', (req, res) => {
  res.send('Todo API Root')
})

app.get('/todos', (req, res) => {
  let qParams = req.query
  let where = {}

  if (qParams.hasOwnProperty('completed') && qParams.completed === 'true') where.completed = true
  else if (qParams.hasOwnProperty('completed') && qParams.completed === 'false') where.completed = false

  if (qParams.hasOwnProperty('q') && qParams.q.length > 0) where.description = {
    $like: '%' + qParams.q + '%'
  }

  db.todo.findAll({where})
    .then(todos => res.json(todos), e => res.send(500).send())
})

app.get('/todos/:id', (req, res) => {
  let todoId = parseInt(req.params.id, 10)

  db.todo.findById(todoId)
    .then( todo => {
      todo
      ? res.json(todo.toJSON())
      : res.status(404).send('oopsie')
    }, e => res.status(500).send())
    .catch(ex => console.error(ex.message))
})

// POST

app.post('/todos', (req, res) => {
  let body = _.pick(req.body, 'description', 'completed')

  db.todo.create(body)
    .then(
      todo => res.json(todo.toJSON()),
      e => res.status(400).json(e)
    )
})


// DELETE

app.delete('/todos/:id', (req, res) => {
  let todoId = parseInt(req.params.id, 10)

  db.todo.destroy({
    where: {
      id: todoId
    }
  })
    .then(rowsDeleted => {
      rowsDeleted === 0
      ? res.status(404).json({ error: 'No todo with id ' + todoId })
      : res.status(204).send()
    }, () => res.status(500).send())
})

// UPDATE

app.put('/todos/:id', (req, res) => {
  let body = _.pick(req.body, 'description', 'completed')
  let validAttributes = {}
  let todoId = parseInt(req.params.id, 10)
  let matchedTodo = _.findWhere(todos, {id: todoId})

  if (!matchedTodo) {
    return res.status(404).send()
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send()
  }

  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send()
  }

  _.extend(matchedTodo, validAttributes)

  res.status(200).send('updated task ' + matchedTodo.description)

})

db.sequelize.sync().then( () => {
  app.listen(PORT, () => console.log('Express listening on port ' + PORT) )
})

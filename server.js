const express = require('express')
const bodyParser = require('body-parser')
const _ = require('underscore')
const bcrypt = require('bcrypt')

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

app.post('/users', (req, res) => {
  let body = _.pick(req.body, 'email', 'password')

  db.user.create(body)
    .then(
      user => res.json(user.toPublicJSON()),
      e => res.status(400).json(e)
    )
})

app.post('/users/login', (req, res) => {
  let body = _.pick(req.body, 'email', 'password')

  if (typeof body.email !== 'string' || typeof body.password !== 'string') {
    res.status(400).send()
  }

  db.user.findOne({
    where: {
      email: body.email
    }
  })
    .then( user => {
      if (!user || !bcrypt.compareSync(body.password, user.get('password_hash'))) {
        return res.status(401).send()
      }

      res.json(user.toPublicJSON())
    }, e => res.status(500).send())

  // res.json(body)
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
  let todoId = parseInt(req.params.id, 10)
  let attributes = {}

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed
  }

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description
  }

  db.todo.findById(todoId)
    .then( todo => {
      if (todo) {
        return todo.update(attributes)
      } else {
        res.status(404).send()
      }
    }, () => res.status(500).send())
    .then( todo => res.json(todo.toJSON()), e => res.status(400).json(e))
})




db.sequelize.sync().then( () => {
  app.listen(PORT, () => console.log('Express listening on port ' + PORT) )
})

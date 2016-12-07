const express = require('express')
const bodyParser = require('body-parser')
const _ = require('underscore')

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
  res.json(todos)
})

app.get('/todos/:id', (req, res) => {
  let todoId = parseInt(req.params.id, 10)
  let matchedTodo = _.findWhere(todos, {id: todoId})

  if (matchedTodo) {
    res.json(matchedTodo)
  } else {
    res.status(404).send('ooopsie...')
  }
})

// POST

app.post('/todos', (req, res) => {
  let body = _.pick(req.body, 'description', 'completed')

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0){
    return res.status(400).send()
  }

  body.id = todoNextId

  body.description = body.description.trim()

  todos.push(body)

  console.log('id ' + body.id +' | description: ' + body.description)
  res.json(body)
  todoNextId++
})


// DELETE

app.delete('/todos/:id', (req, res) => {
  let todoId = parseInt(req.params.id, 10)
  let matchedTodo = _.findWhere(todos, {id: todoId})

  if (matchedTodo) {
    res.status(200).send('deleted ' + matchedTodo.description)
    todos = _.without(todos, matchedTodo)
  } else {
    res.status(400).send('id not found')
  }
})

app.listen(PORT, () => console.log('Express listening on port ' + PORT) )

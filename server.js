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
  let qParams = req.query
  let filteredTodos = todos

  if (qParams.hasOwnProperty('completed') && qParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {completed: true})
  } else if (qParams.hasOwnProperty('completed') && qParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {completed: false})
  }

  res.json(filteredTodos)
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
    todos = _.without(todos, matchedTodo)
    res.status(200).send('deleted ' + matchedTodo.description)
  } else {
    res.status(404).json({error: "id not found"})
  }
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

app.listen(PORT, () => console.log('Express listening on port ' + PORT) )

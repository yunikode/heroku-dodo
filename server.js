const express = require('express')
const bodyParser = require('body-parser')

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
  var matchedTodo

  todos.forEach( todo => {
    if (todoId === todo.id) {
      matchedTodo = todo
    }
  })

  if (matchedTodo) {
    res.json(matchedTodo)
  } else {
    res.status(404).send('ooopsie...')
  }
})

// POST

app.post('/todos', (req, res) => {
  let body = req.body
  body.id = todoNextId

  todos.push(body)

  console.log('id ' + body.id +' | description: ' + body.description)
  res.json(body)
  todoNextId++
})

app.listen(PORT, () => console.log('Express listening on port ' + PORT) )

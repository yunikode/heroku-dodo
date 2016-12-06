const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

let todos = [{
  id: 0,
  description: 'Do the laundry',
  completed: false
},
{
  id: 1,
  description: 'Go to market',
  completed: false
},
{
  id: 2,
  description: 'Read the manual',
  completed: true
}]

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

app.listen(PORT, () => console.log('Express listening on port ' + PORT) )

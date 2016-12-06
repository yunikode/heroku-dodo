const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000

let todos = [{
  id: 1,
  description: 'Do the laundry',
  completed: false
},
{
  id: 2,
  description: 'Go to market',
  completed: false
},
{
  id: 3,
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
  if (typeof todos[req.params.id] === 'undefined') {
    res.status(404).send('ooopsie...')
  } else {
    res.json(todos[req.params.id].description)
  }
})

app.listen(PORT, () => console.log('Express listening on port ' + PORT) )

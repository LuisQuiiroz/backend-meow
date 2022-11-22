const express = require('express')
const app =express()
const morgan = require('morgan')

//json parser de express
app.use(express.json())

morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let posts = [
  {
    id:1,
    content : 'mi gato es hermoso',
    likes: 0,
    comment: '',
    url_img: ''
  },
  {
    id:2,
    content : 'Gato jugueton',
    likes: 0,
    comment: '',
    url_img: ''
  },
  {
    id:3,
    content : 'Gato dormido',
    likes: 0,
    comment: '',
    url_img: ''
  },
]

const generateId = () => {
  const maxId = posts.length > 0
    ? Math.max(...posts.map(p => p.id))
    : 0
  return maxId + 1
}

app.post('/api/posts', (request, response) => {
  
  const body = request.body

  if(!body.content){
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const post = {
    id: generateId(),
    content : body.content,
    likes: 0,
    comment: '',
    url_img: ''
  }

  posts = posts.concat(post)

  response.json(post)
})

app.get('/', (request, response) => {
  response.send('Hellow world')
})


app.get('/api/posts', (request, response) => {
  response.json(posts)
})

app.get('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id)
  const post = posts.find(post => post.id === id)

  if(post){
    response.json(post)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id)
  posts = posts.filter(post => post.id !== id)
  response.status(204).end()
})

app.get('/info', (request, response) => {
  const date = new Date()
  response.send(`Hay ${posts.length} posts en total <br> ${date}`)
})

//Rutas desconocidas
const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
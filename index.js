require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const PostsDB = require('./models/posts')
const { errorHandler } = require('./utils/errorHandler')

// permite solicitudes a otras url
app.use(cors())

// json parser de express, para que pueda ser mostrado correctamente
app.use(express.json())

// morgan, muestra informacion en consola de todas las peticiones
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// crear un nuevo post, por el momento sin usuario
app.post('/api/posts', async (request, response) => {
  const body = request.body

  if (!body.content || body.content === undefined) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  // Nuevo post
  const post = new PostsDB({
    content: body.content || '',
    url_img: body.url_img || '',
    likes: 0,
    comments: '',
    date: new Date()
  })

  const savepost = await post.save()
  response.json(savepost)
})

// Inicio
app.get('/', (request, response) => {
  response.send('Hellow world')
})

// obetner todos los posts
app.get('/api/posts', async (request, response) => {
  const posts = await PostsDB.find({})
  response.json(posts)
})

// obtener un post mediante su uid
app.get('/api/posts/:uid', async (request, response, next) => {
  const uid = request.params.uid
  try {
    const post = await PostsDB.findById(uid)
    if (post) {
      response.json(post)
    } else {
      response.status(400).send({ error: 'the post does not exist' })
    }
  } catch (error) { next(error) }
})

// eliminar un post mediante su uid
app.delete('/api/posts/:uid', async (request, response, next) => {
  const uid = request.params.uid
  try {
    await PostsDB.findByIdAndRemove(uid)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

// actualizar el contenido o la imagen de un post por medio de su uid
app.put('/api/posts/:uid', async (request, response, next) => {
  const uid = request.params.uid
  const body = request.body

  const postToUpdate = {
    content: body.content,
    url_img: body.url_img
  }

  const updatedPost = await PostsDB.findByIdAndUpdate(uid, postToUpdate, { new: true })
  // {new : true} devuelve el objeto actualizado
  response.json(updatedPost)
})

// informacion del numero de posts
app.get('/info', async (request, response) => {
  const date = new Date()
  const posts = await PostsDB.find({})
  response.send(`Hay ${posts.length} posts en total <br> ${date}`)
})

// Rutas desconocidas
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

// manejo de errores
app.use(errorHandler)

// puerto en el que se ejecuta la aplicacion
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

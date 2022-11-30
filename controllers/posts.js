const postsRouter = require('express').Router()
const PostsDB = require('../models/post')
const logger = require('../utils/logger')

// informacion del numero de posts
postsRouter.get('/info', async (request, response) => {
  const date = new Date()
  const posts = await PostsDB.find({})
  response.send(`Hay ${posts.length} posts en total <br> ${date}`)
})

// obetner todos los posts
postsRouter.get('/', async (request, response) => {
  const posts = await PostsDB.find({})
  response.json(posts)
})

// obtener un post mediante su uid
postsRouter.get('/:uid', async (request, response, next) => {
  const uid = request.params.uid
  try {
    const post = await PostsDB.findById(uid)
    if (post) {
      response.json(post)
    } else {
      logger.error('Sorry, that post does not exist')
      response.status(400).send({ error: 'Lo sentimos, ese post no existe' })
    }
  } catch (error) { next(error) }
})

// crear un nuevo post, por el momento sin usuario
postsRouter.post('/', async (request, response) => {
  const body = request.body

  if ((!body.content || body.content === undefined) && (!body.url_img || body.url_img === undefined)) {
    logger.error('Content missing')
    return response.status(400).json({
      error: 'falta contenido'
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
  logger.info('Posted')
})

// eliminar un post mediante su uid
postsRouter.delete('/:uid', async (request, response, next) => {
  const uid = request.params.uid
  try {
    await PostsDB.findByIdAndRemove(uid)
    response.status(204).end()
    logger.info('Post deleted')
  } catch (error) {
    next(error)
  }
})

// actualizar el contenido o la imagen de un post por medio de su uid
postsRouter.put('/:uid', async (request, response, next) => {
  const uid = request.params.uid
  const body = request.body

  const postToUpdate = {
    content: body.content,
    url_img: body.url_img
  }

  try {
    const updatedPost = await PostsDB.findByIdAndUpdate(uid, postToUpdate, { new: true })
    // {new : true} devuelve el objeto actualizado
    response.json(updatedPost)
    logger.info('updated post')
  } catch (error) {
    next(error)
  }
})


module.exports = postsRouter
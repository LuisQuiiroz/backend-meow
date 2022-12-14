const postsRouter = require('express').Router()
const PostsDB = require('../models/post')
const UsersDB = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

// informacion del numero de posts
postsRouter.get('/info', async (request, response, next) => {
  const date = new Date()
  const posts = await PostsDB.find({})
  response.send(`Hay ${posts.length} posts en total <br> ${date}`)
})

// Obtener todos los posts
postsRouter.get('/', async (request, response, next) => {
  const posts = await PostsDB
    .find({}).populate('userId', { email: 1, username: 1 })
  response.json(posts)
})

// obtener un post mediante su pid
postsRouter.get('/:pid', async (request, response, next) => {
  const pid = request.params.pid
  const post = await PostsDB.findById(pid)
  if (post) {
    response.json(post)
  } else {
    logger.error('Sorry, that post does not exist')
    response.status(400).send({ error: 'Lo sentimos, ese post no existe' })
  }
})

// crear un nuevo post, por el momento sin usuario
postsRouter.post('/', async (request, response, next) => {
  // body debe de traer al menos lo siguiente
  // content
  // url_img
  // userId
  const body = request.body

  const decodedToken = jwt.verify(request.token, config.SECRET)

  // valida que haya token
  if (!request.token || !decodedToken.uid) {
    return response.status(401).json({ error: 'falta el token o no es válido' })
  }

  const user = await UsersDB.findById(decodedToken.uid)

  // Valida que la publicacion no venga vacia
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
    date: new Date(),
    userId: user._id // asi es como viene de la base de datos
  })

  const savedpost = await post.save()
  user.postsId = user.postsId.concat(savedpost._id)
  await user.save()

  response.json(savedpost)
  logger.info('Posted')
})

// eliminar un post mediante su uid
postsRouter.delete('/:uid', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  // valida que haya token
  if (!request.token || !decodedToken.uid) {
    return response.status(401).json({ error: 'falta el token o no es válido' })
  }
  const uid = request.params.uid

  const postToDelete = await PostsDB.findById(uid)
  const userOfPost = await UsersDB.findById(decodedToken.uid)

  // valida no existe el post o si el post a eliminar coincide con la persona dueña del post
  if ((postToDelete === null) || (postToDelete.userId.toString() !== userOfPost._id.toString())) {
    return response.status(401).json({ error: 'No existe el post' })
  }

  // Elimina el post de todos los posts
  await PostsDB.findByIdAndRemove(postToDelete._id)
  // Elimina el post del usuario que lo creó
  await UsersDB.findOneAndRemove(postToDelete._id)

  response.status(204).end()
  logger.info('Post deleted')
})

// actualizar el contenido o la imagen de un post por medio de su uid
postsRouter.put('/:uid', async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, config.SECRET)
  // valida que haya token
  if (!request.token || !decodedToken.uid) {
    return response.status(401).json({ error: 'falta el token o no es válido' })
  }
  const uid = request.params.uid
  const body = request.body

  const postToUpdateFromDb = await PostsDB.findById(uid)
  const userOfPost = await UsersDB.findById(decodedToken.uid)

  if (postToUpdateFromDb === null) {
    return response.status(401).json({ error: 'No se econtró el post' })
  } else if (postToUpdateFromDb.userId.toString() !== userOfPost._id.toString()) {
    return response.status(401).json({ error: 'No puedes modificar este post' })
  }
  const postToUpdate = {
    content: body.content,
    url_img: body.url_img
  }

  const updatedPost = await PostsDB.findByIdAndUpdate(uid, postToUpdate, { new: true })
  // {new : true} devuelve el objeto actualizado
  response.json(updatedPost)
  logger.info('updated post')
})

module.exports = postsRouter

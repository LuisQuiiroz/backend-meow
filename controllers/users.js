const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const UsersDB = require('../models/user')
const logger = require('../utils/logger')

// obtiene todos los usuarios
usersRouter.get('/', async (request, response, next) => {
  const users = await UsersDB
    .find({}).populate('postsId', { content: 1, url_img: 1 })
    // populate() trae toda la informacion pertenecientes a los ids de postsId
  response.json(users)
})

// Obtiene un usuario
usersRouter.get('/:uid', async (request, response, next) => {
  const uid = request.params.uid
  const user = await UsersDB.findById(uid)
  if (user) {
    response.json(user)
  } else {
    logger.error('Sorry, that users does not exist')
    response.status(400).json({ error: 'No existe ese usuario' })
  }
})

// crear un usuario nuevo
usersRouter.post('/', async (request, response, next) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new UsersDB({
    email: body.email,
    username: body.username,
    passwordHash
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

module.exports = usersRouter

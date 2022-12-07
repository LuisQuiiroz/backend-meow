const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const UsersDB = require('../models/user')
const config = require('../utils/config')

// Login de usuario
loginRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await UsersDB.findOne({ username: body.username })
  const passwordCoorect = user === null
    ? false
    // Verifica si la contraseña introducida es correcta, la compara con la de la base de datos
    : await bcrypt.compare(body.password, user.passwordHash)

  if (!(user && passwordCoorect)) {
    return response.status(401).json({
      error: 'nombre de usuario y/o contraseña incorrectos'
    })
  }

  const userForToken = {
    username: user.username,
    uid: user._id
  }

  // Creación del token
  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: '30d' })

  response
    .status(200)
    .send({ token, username: user.username })
})
module.exports = loginRouter

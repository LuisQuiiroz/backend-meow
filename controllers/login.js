const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const UsersDB = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response, next) => {
  const body = request.body

  const user = await UsersDB.findOne({ username: body.username })
  console.log(user)
  const passwordCoorect = user === null
    ? false
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

  const token = jwt.sign(userForToken, config.SECRET)

  response
    .status(200)
    .send({ token, username: user.username })
})
module.exports = loginRouter

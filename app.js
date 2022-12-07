const config = require('./utils/config')
const express = require('express')
// express-async-errors elimina el try-catch
// Si ocurre una excepción en una ruta async, la ejecución se pasa automáticamente al middleware de manejo de errores.
require('express-async-errors')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const usersRouter = require('./controllers/users')
const postsRouter = require('./controllers/posts')
const loginRouter = require('./controllers/login')
const { unknownEndpoint, errorHandler } = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const tokenExtractor = require('./utils/tokenExtractor ')

logger.info('connecting...')

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to mongoDB:', error.message)
  })

// permite solicitudes a otras url
app.use(cors())

// build
// app.use(express.static('build'))

// json parser de express, para que pueda ser mostrado correctamente
app.use(express.json())

// morgan, muestra informacion en consola de todas las peticiones
morgan.token('body', req => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// // Inicio
// postsRouter.get('/', (request, response) => {
//   response.send('Hellow world')
// })

// Pone el token en request(request.token), si es que se proporciona en la solicitud
app.use(tokenExtractor)

// Rutas
app.use('/api/users', usersRouter)
app.use('/api/posts', postsRouter)
app.use('/api/login', loginRouter)

// Rutas desconocidas
app.use(unknownEndpoint)

// manejo de errores
app.use(errorHandler)

module.exports = app

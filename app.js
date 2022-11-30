const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const postsRouter = require('./controllers/posts')
const { unknownEndpoint, errorHandler } = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

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

// Rutas
app.use('/api/posts', postsRouter)

// Rutas desconocidas
app.use(unknownEndpoint)

// manejo de errores
app.use(errorHandler)

module.exports = app

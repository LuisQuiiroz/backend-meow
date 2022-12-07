const logger = require('./logger')

const unknownEndpoint = (request, response, next) => {
  response.status(404).json({ error: 'Ruta desconocida' })
}

const typeOfError = {
  CastError: { http: 400, msg: 'id con formato incorrecto' },
  ValidationError: { http: 400 },
  JsonWebTokenError: { http: 400, msg: 'token invalido' },
  TokenExpiredError: { http: 401, msg: 'Vuelve a iniciar sesión' }
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (typeOfError[error.name]) {
    return response
      .status(typeOfError[error.name].http)
      .json({ error: typeOfError[error.name].msg || error.message })
  }
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}

require('dotenv').config()
// variables de entorno
// estas varaibles se encuentran en el archivo .env

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const SECRET = process.env.SECRET

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
}

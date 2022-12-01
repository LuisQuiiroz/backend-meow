const mongoose = require('mongoose')

// Esquema MongoDB
const postSchema = new mongoose.Schema({
  content: String,
  url_img: String,
  likes: Number,
  comments: String,
  date: Date,
  userId: {
    // Hace refrencia al id del usuario
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

// Formatea visualmente los datos
postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.pid = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Post', postSchema)

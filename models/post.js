const mongoose = require('mongoose')

// Esquema MongoDB
const postSchema = new mongoose.Schema({
  content: String,
  url_img: String,
  likes: Number,
  comments: String,
  date: Date,
  uid: String
})

// Formatea visualmente los datos
postSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.uid = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Post', postSchema)

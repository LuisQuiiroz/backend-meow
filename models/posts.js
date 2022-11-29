const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to mongoDB:', error.message)
  })

// Esquema MongoDB
const postSchema = new mongoose.Schema({
  content: String,
  date: Date,
  url_img: String,
  likes: Number,
  comments: String,
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

// const Post = mongoose.model('Post', postSchema)

module.exports = mongoose.model('Post', postSchema)

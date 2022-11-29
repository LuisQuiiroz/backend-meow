const mongoose = require('mongoose')

// mongoose.connect(process.env.MONGODB_URI)

if (process.env.length < 3) {
  console.log('please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.evqrs.mongodb.net/meow-app?retryWrites=true&w=majority`

mongoose.connect(url)

// Esquema MongoDB
const postSchema = new mongoose.Schema({
  content: String,
  date: Date,
  url_img: String,
  likes: Number,
  comments: String,
  uid: String
})

const Post = mongoose.model('Post', postSchema)

// New post
const post = new Post({
  content: 'Tengo un nuevo amigo en casa',
  date: new Date(),
  url_img: 'https://www.marketingdirecto.com/wp-content/uploads/2020/12/loteria-holanda-frummel.jpg',
  likes: 0,
  comments: '',
  uid: ''
})

// Guardar post
post.save().then(result => {
  console.log('post publicado!')
  mongoose.connection.close()
})

Post.find({}).then(result => {
  result.forEach(post => {
    console.log(post)
  })
  mongoose.connection.close()
})

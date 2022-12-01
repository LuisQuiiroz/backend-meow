const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    minlength: [3, 'Al menos 3 caracteres'],
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  postsId: [
    {
      // Hace refrencia al id del post
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
})

// válida que el campo sea único, es decir, que ya no se encuentre en la base de datos (se require la propiedad: unique: true, dentro de un campo del schema)
userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.uid = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // La contraseña no debe de ser revelada en ningun momento
    delete returnedObject.passwordHash
  }
})

module.exports = mongoose.model('User', userSchema)

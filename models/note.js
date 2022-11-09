const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: { type: String, minLength: 5, required: true },
  date: { type: Date, required: true },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  description: { type: String },
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Note', noteSchema)

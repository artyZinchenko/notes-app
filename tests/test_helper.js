const Note = require('../models/note')
const User = require('../models/user')

const initialNotes = [
  {
    content: 'HTML is easy',
    date: new Date(),
    important: false,
  },
  {
    content: 'Browser can execute only Javascript',
    date: new Date(),
    important: true,
  },
]

const noneExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon', date: new Date() })

  await note.save()
  await note.remove()

  return note._id.toString()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((el) => el.toJSON())
}

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map((note) => note.toJSON())
}

module.exports = {
  noneExistingId,
  initialNotes,
  notesInDb,
  usersInDb,
}

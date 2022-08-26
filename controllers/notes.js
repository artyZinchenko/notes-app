const notesRouter = require('express').Router()
const Note = require('../models/note')
require('express-async-errors')
const User = require('../models/user')

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const user = await User.findById(body.userId)
  console.log(user)

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user._id,
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await User.findOneAndUpdate({ _id: user._id }, { notes: user.notes })

  response.status(201).json(savedNote)
})

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })
  response.json(notes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) response.json(note)
  else response.status(404).end()
})

notesRouter.delete('/:id', async (req, res) => {
  await Note.findByIdAndRemove(req.params.id)
  res.status(204).end()
})

notesRouter.put('/:id', (req, res, next) => {
  const { content, important } = req.body

  Note.findByIdAndUpdate(req.params.id, { content, important }, { new: true })
    .then((updatedNote) => {
      res.json(updatedNote)
    })
    .catch((err) => {
      next(err)
    })
})

module.exports = notesRouter

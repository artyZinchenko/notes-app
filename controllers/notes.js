const notesRouter = require('express').Router()
const Note = require('../models/note')
require('express-async-errors')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findOne({ _id: decodedToken.id })
  if (!user) {
    return response
      .status(404)
      .json({ error: 'invalid user, please re-enter app' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    user: user.id,
    description: body.description,
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await User.findOneAndUpdate({ _id: user._id }, { notes: user.notes })

  response.status(201).json(savedNote)
})

notesRouter.get('/', async (request, response) => {
  const token = getTokenFrom(request)
  const decodedToken = jwt.verify(token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findOne({ _id: decodedToken.id })
  if (!user) {
    return response
      .status(404)
      .json({ error: 'invalid user, please re-enter app' })
  }

  const notes = await Note.find({}).populate('user', { username: 1, name: 1 })

  const filteredNotes = notes.filter((el) => {
    if (!el.user) return
    return el.user._id.toString() === user._id.toString()
  })

  response.json(filteredNotes)
})

notesRouter.get('/:id', async (request, response) => {
  const note = await Note.findById(request.params.id)
  if (note) response.json(note)
  else response.status(404).end()
})

notesRouter.delete('/:id', async (request, response) => {
  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

notesRouter.put('/:id', async (request, response) => {
  const { content, important, description } = request.body

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { content, important, description },
    { new: true }
  )

  response.json(updatedNote).end()
})

module.exports = notesRouter

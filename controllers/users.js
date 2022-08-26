const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
require('express-async-errors')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (!password) {
    return response.status(400).json({ error: 'password is required' })
  }

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({ error: 'username must be unique' })
  }

  const allowedCharacters = new RegExp('^[a-zA-Z0-9.-]+$')
  const onlyAllowedChars = allowedCharacters.test(username)
  if (!onlyAllowedChars) {
    return response
      .status(400)
      .json({ error: 'you can use only letters or numbers' })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: 'password has to be at least 3 charecters long',
    })
  }

  const saltRounds = 10

  const hashPassword = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    hashPassword,
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('notes', { content: 1, date: 1 })
  response.json(users)
})

module.exports = usersRouter

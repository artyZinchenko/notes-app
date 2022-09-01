const jwt = require('jsonwebtoken')
const User = require('../models/user')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
require('express-async-errors')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const foundUser = await User.findOne({ username })

  const passwordCorrect =
    foundUser === null
      ? false
      : await bcrypt.compare(password, foundUser.passwordHash)

  if (!(passwordCorrect && foundUser)) {
    return response.json({ error: 'username or password is not valid' })
  }

  const token = jwt.sign(
    { username: foundUser.username, id: foundUser._id },
    process.env.SECRET
  )

  response
    .status(201)
    .send({ token, username: foundUser.username, name: foundUser.name })
})

module.exports = loginRouter

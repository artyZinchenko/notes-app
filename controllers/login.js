const jwt = require('jsonwebtoken')
const User = require('../models/user')
const loginRouter = require('express').Router()
const bcrypt = require('bcrypt')
require('express-async-errors')

loginRouter('/', async (request, response) => {
  const { username, password } = request.body

  const foundUser = await User.find({ username })
  console.log('user', foundUser)

  const validUser =
    foundUser === null
      ? false
      : await bcrypt.compare(password, foundUser.passwordHash)

  if (!(validUser && foundUser)) {
    return response.json({ error: 'username or password is not valid' })
  }

  const token = await jwt.sign(
    { username: foundUser.username, id: foundUser._id },
    process.env.SECRET
  )

  response.status(201).json({ token })
})

module.exports = loginRouter

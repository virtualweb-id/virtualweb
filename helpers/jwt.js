const jwt = require('jsonwebtoken')
const { SECRET_KEY } = process.env

const generateToken = payload => {
  const token = jwt.sign(payload, SECRET_KEY)
  return token
}

const verifyToken = token => {
  const isMatching = jwt.verify(token, SECRET_KEY)
  return isMatching
}

module.exports = { generateToken, verifyToken }
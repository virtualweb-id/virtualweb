const { verifyToken } = require('../helpers/jwt')
const { User } = require('../models')

async function authentication(req, res, next) {
  try {
    const decoded = verifyToken(req.headers.access_token)
    const user = await User.findOne({
      where: { email: decoded.email }
    })
    if (!user) {
      next({ name: 'accessDenied' })
    } else {
      req.user = { id: user.id, email: user.email }
      next()
    }
  } catch (err) {
    next(err)
  }
}

module.exports = { authentication }

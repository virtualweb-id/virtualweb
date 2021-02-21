const { verifyToken } = require('../helpers')
const { User, Guest, Wedding, Invitation } = require('../models')

async function authentication(req, res, next) {
  try {
    const { access_token } = req.headers
    if (!access_token) {
      next({ name: 'ErrorAccessToken' })
    } else {
      const decoded = verifyToken(access_token)
      const user = await User.findOne({
        where: { email: decoded.email }
      })
      if (!user) {
        next({ name: 'ErrorAuthenticate' })
      } else {
        req.user = { id: user.id, email: user.email }
        next()
      }
    }
  } catch (err) {
    next(err)
  }
}

const authorizeGuest = async (req, res, next) => {
  try {
    const { id } = req.params
    const UserId = req.user.id
    const guest = await Guest.findOne({
      where: { id }
    })
    if (guest) {
      if (UserId == guest.UserId) {
        next()
      } else {
        next({ name: 'ErrorAuthorize' })
      }
    } else {
      next({ name: 'ErrorNotFound' })
    }
  } catch (err) {
    next(err)
  }
}

const authorizeWedding = async (req, res, next) => {
  try {
    const { id } = req.params
    const UserId = req.user.id
    const wedding = await Wedding.findOne({
      where: { id }
    })
    if (wedding) {
      if (UserId == wedding.UserId) {
        next()
      } else {
        next({ name: 'ErrorAuthorize' })
      }
    } else {
      next({ name: 'ErrorNotFound' })
    }
  } catch (err) {
    next(err)
  }
}

const authorizeInvitation = async (req, res, next) => {
  try {
    const { id } = req.params
    const UserId = req.user.id
    const wedding = await Wedding.findOne({
      where: { UserId }
    })
    const invitation = await Invitation.findOne({
      where: { id }
    })
    if (invitation) {
      if (wedding.id == invitation.WeddingId) {
        next()
      } else {
        next({ name: 'ErrorAuthorize' })
      }
    } else {
      next({ name: 'ErrorNotFound' })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = { authentication, authorizeGuest, authorizeWedding, authorizeInvitation }

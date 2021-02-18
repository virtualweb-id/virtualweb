const { verifyToken } = require('../helpers/jwt')
const { User, Guest } = require('../models')

async function authentication(req, res, next) {
  try {
    const decoded = verifyToken(req.headers.access_token)
    const user = await User.findOne({
      where: { email: decoded.email }
    })
    if (!user) {
      next({ name: 'ErrorAuthenticate' })
    } else {
      req.user = { id: user.id, email: user.email }
      next()
    }
  } catch (err) {
    next(err)
  }
}

const authorizeGuest = async (req,res,next) => {
  try {
    const { id } = req.params
    const UserId = req.user.id
    const guest = await Guest.findOne({
      where: {id}
    })
    if(guest){
      if(UserId == guest.UserId){
        next()
      }else{
        next({name: 'ErrorAuthorize'})
      }
    }else{
      next({name: 'ErrorNotFound'})
    }
  } catch (err) {
    next(err)
  }
}

module.exports = { authentication, authorizeGuest }

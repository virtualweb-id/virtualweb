const { User } = require('../models')
const { comparePwd, generateToken, sendToUser } = require('../helpers')

class UserController {
  static async register(req, res, next) {
    try {
      const { name, email, password, phoneNumber } = req.body
      const user = await User.create({
        name: name || '',
        email: email || '',
        password: password || '',
        phoneNumber: phoneNumber || ''
      })
      await sendToUser(user.name, user.email)
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber
      })
    } catch (err) {
      next(err)
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body
      if (!email || !password) return next({ name: 'InvalidPassOrEmail' })

      const user = await User.findOne({ where: {email} })
      if (!user) {
        next({ name: 'InvalidPassOrEmail' })
      } else {
        const isMatching = comparePwd(password, user.password)
        if (!isMatching) {
          next({ name: 'InvalidPassOrEmail' })
        } else {
          const payload = { id: user.id, email: user.email }
          const access_token = generateToken(payload)
          res.status(200).json({ 
            id: user.id,
            name: user.name,
            email: user.email,
            access_token 
          })
        }
      }
    } catch (err) {
      next(err)
    }
  }
}

module.exports = UserController
const { User } = require('../models')
const { comparePwd } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

class UserController {
  static register(req, res, next) {
    const { name, email, password, phoneNumber } = req.body
    const newUser = { name, email, password, phoneNumber }

    User.create(newUser)
      .then(user => {
        return res.status(201).json(user)
      })
      .catch(err => {
        next(err)
      })
  }

  static login(req, res, next) {
    const { email, password } = req.body
    
    if (!email || !password) return next({ name: 'InvalidPassOrEmail' })

    User.findOne({ where: {email} })
      .then(user => {
        if (!user) {
          next({ name: 'InvalidPassOrEmail' })
        } else {
          const isMatching = comparePwd(password, user.password)
          if (!isMatching) {
            next({ name: 'InvalidPassOrEmail' })
          } else {
            const payload = { id: user.id, email: user.email }
            const access_token = generateToken(payload)
            res.status(200).json({ access_token })
          }
        }
      })
      .catch(err => {
        next(err)
      })
  }
}

module.exports = UserController
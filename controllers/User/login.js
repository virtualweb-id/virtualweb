const { User } = require('../../models')
const { comparePwd, generateToken } = require('../../helpers')

module.exports = async (req, res, next) => {
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
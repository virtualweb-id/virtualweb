const { User } = require('../../models')
const { sendToUser } = require('../../helpers')

module.exports = async (req, res, next) => {
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
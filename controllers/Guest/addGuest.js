const { Guest } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const UserId = req.user.id
    const { name, email, phoneNumber, status } = req.body
    const guest = await Guest.create({
      id: Math.random() * 10e8 | 0,
      name: name || '',
      email: email || '',
      phoneNumber: phoneNumber || '',
      status: status || null,
      UserId
    })
    res.status(201).json(guest)
  } catch (err) {
    next(err)
  }
}
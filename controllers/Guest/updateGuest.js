const { Guest } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, email, phoneNumber } = req.body
    const guest = await Guest.update({
      name: name || '',
      email: email || '',
      phoneNumber: phoneNumber || '',
    }, {
      where: { id },
      returning: true
    })
    res.status(200).json(guest[1][0])
  } catch (err) {
    next(err)
  }
}
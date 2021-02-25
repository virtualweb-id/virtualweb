const { Guest } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    const guest = await Guest.findByPk(id)
    res.status(200).json(guest)
  } catch (err) {
    next(err)
  }
}
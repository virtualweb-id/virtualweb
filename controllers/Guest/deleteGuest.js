const { Guest } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    await Guest.destroy({ where: { id } })
    res.status(200).json({ message: 'Delete guest successful' })
  } catch (err) {
    next(err)
  }
}
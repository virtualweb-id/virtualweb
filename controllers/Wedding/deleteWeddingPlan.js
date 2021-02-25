const { Wedding } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    await Wedding.destroy({ where: { id } })
    res.status(200).json({ message: 'Wedding deleted' })
  } catch (error) {
    next(error)
  }
}
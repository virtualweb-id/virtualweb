const { Guest } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const UserId = req.user.id
    const guests = await Guest.findAll({
      order: [['createdAt', 'DESC']],
      where: { UserId }
    })
    res.status(200).json(guests)
  } catch (err) {
    next(err)
  }
}
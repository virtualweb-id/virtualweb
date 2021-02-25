const { Invitation, Wedding } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const UserId = req.user.id
    const data = await Wedding.findOne({
      where: {UserId},
      include: [Invitation]
    })
    res.status(200).json(data || {})
  } catch (error) {
    next(error)
  }
}
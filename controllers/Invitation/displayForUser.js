const { Wedding, Invitation } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const UserId = req.user.id
    const { id: WeddingId } = await Wedding.findOne({ where: {UserId} })
    const invitation = await Invitation.findOne({ where: { WeddingId } })
    if (invitation) {
      res.status(200).json(invitation)
    } else {
      next({ name: 'ErrorNotFound' })
    }
  } catch (err) {
    next(err)
  }
}
const { Comment, Invitation, Wedding } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    const invitation = await Invitation.findOne({ where: { id }, include: [Wedding, Comment] })
    res.status(200).json(invitation)
  } catch (error) {
    next(error)
  }
}
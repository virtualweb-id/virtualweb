const { Comment } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const { id: InvitationId } = req.params
    const comments = await Comment.findAll({
      order: [['createdAt', 'DESC']],
      where: { InvitationId }
    })
    res.status(200).json(comments)
  } catch (err) {
    next(err)
  }
}
const { Comment } = require('../../models')

module.exports = async (req, res, next) => {
  try {
    const { name, relationship, message, InvitationId } = req.body
    const comment = await Comment.create({
      name: name || '', 
      relationship: relationship || '', 
      message: message || '', 
      InvitationId
    })
    res.status(201).json(comment)
  } catch (err) {
    next(err)
  }
}
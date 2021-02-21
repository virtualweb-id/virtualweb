const { Comment } = require('../models')

class CommentController {
  static async findAllComment (req, res, next) {
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

  static async create (req, res, next) {
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
  
}

module.exports = CommentController
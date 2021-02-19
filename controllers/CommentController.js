const { Comment, Wedding } = require('../models')

class CommentController {
  static async findAll (req, res, next) {
    try {
      const UserId = req.user.id
      const { id: WeddingId } = await Wedding.findByPk(UserId)
      const comments = await Comment.findAll({
        order: [['createdAt', 'DESC']],
        where: { WeddingId }
      })
      res.status(200).json(comments)
    } catch (err) {
      next(err)
    }
  }

  static async create (req, res, next) {
    try {
      const { name, relationship, message, WeddingId } = req.body
      const comment = await Comment.create({
        name: name || '', 
        relationship: relationship || '', 
        message: message || '', 
        WeddingId
      })
      res.status(201).json(comment)
    } catch (err) {
      next(err)
    }
  }
  
}

module.exports = CommentController
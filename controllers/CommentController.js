const { Comment } = require('../models')

class CommentController {
  static async findAll (req, res, next) {
    try {
      const UserId = req.user.id
      const comments = await Comment.findAll({
        order: [['createdAt', 'DESC']],
        where: { UserId }
      })
      res.status(200).json(comments)
    } catch (err) {
      next(err)
    }
  }

  static async create (req, res, next) {
    try {
      const UserId = req.user.id
      const { name, relationship, message } = req.body
      const comment = await Comment.create({
        name: name || '', 
        relationship: relationship || '', 
        message: message || '', 
        UserId
      })
      res.status(201).json(comment)
    } catch (err) {
      next(err)
    }
  }
  
}

module.exports = CommentController
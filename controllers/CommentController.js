const { Comment } = require('../models')
const Redis = require("ioredis");
const redis = new Redis()

class CommentController {
  static async findAllComment (req, res, next) {
    try {
      const cache = await redis.get('comments')
      if (cache) res.status(200).json(JSON.parse(cache))
      else {
        const { id: InvitationId } = req.params
        const comments = await Comment.findAll({
          order: [['createdAt', 'DESC']],
          where: { InvitationId }
        })
        await redis.set('comments', JSON.stringify(comments))
        res.status(200).json(comments)
      }
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
      await redis.del('comments')
      res.status(201).json(comment)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = CommentController
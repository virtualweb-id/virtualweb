const router = require('express').Router()
const CommentController = require('../controllers/CommentController')

router.post('/', CommentController.create)
router.get('/', CommentController.findAll)

module.exports = router
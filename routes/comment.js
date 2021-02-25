const router = require('express').Router()
const { CommentController } = require('../controllers')

router.post('/', CommentController.addComment)
router.get('/:id', CommentController.findAllComment)

module.exports = router
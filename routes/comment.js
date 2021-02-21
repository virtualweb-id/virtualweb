const router = require('express').Router()
const CommentController = require('../controllers/CommentController')

router.post('/', CommentController.create)
router.get('/:id', CommentController.findAllComment)

module.exports = router
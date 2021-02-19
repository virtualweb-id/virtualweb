const InvitationController = require('../controllers/InvitationController')

const router = require('express').Router()

router.get('/', InvitationController.showOne)
router.put('/:id', InvitationController.edit)


module.exports = router
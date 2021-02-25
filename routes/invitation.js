const router = require('express').Router()
const { InvitationController } = require('../controllers')
const { authorizeInvitation } = require('../middlewares')

router.get('/', InvitationController.displayForUser)
router.put('/:id', authorizeInvitation, InvitationController.updateInvitation)


module.exports = router
const router = require('express').Router()
const Invitation = require('../controllers/InvitationController')

router.use('/:id', Invitation.showById)

module.exports = router
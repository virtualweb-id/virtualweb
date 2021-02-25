const router = require('express').Router()
const { InvitationController } = require('../controllers')

router.use('/:id', InvitationController.displayForGuest)

module.exports = router
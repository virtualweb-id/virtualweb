const InvitationController = require('../controllers/InvitationController')
const { authorizeInvitation } = require('../middlewares/auth')

const router = require('express').Router()

router.get('/', InvitationController.showOne)
router.put('/:id', authorizeInvitation, InvitationController.edit)


module.exports = router
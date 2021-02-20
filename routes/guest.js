const router = require('express').Router()
const GuestController = require('../controllers/GuestController')
const { authorizeGuest } = require('../middlewares/auth')

router.post('/', GuestController.create)
router.get('/', GuestController.findAll)
router.get('/:id', authorizeGuest, GuestController.findById)
router.put('/:id', authorizeGuest, GuestController.edit)
router.patch('/:id', authorizeGuest, GuestController.sendStatus)
router.delete('/:id', authorizeGuest, GuestController.delete)

module.exports = router
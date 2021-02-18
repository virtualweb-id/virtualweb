const router = require('express').Router()
const GuestController = require('../controllers/guestController')

router.get('/guests', GuestController.findAll)
router.get('/guests/:id', GuestController.findById)
router.post('/guests', GuestController.create)
router.put('/guests/:id', GuestController.edit)
router.delete('/guests/:id', GuestController.delete)

module.exports = router
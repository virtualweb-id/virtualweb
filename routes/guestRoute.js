const router = require('express').Router()
const GuestController = require('../controllers/GuestController')

router.post('/', GuestController.create)
router.get('/', GuestController.findAll)
router.get('/:id', GuestController.findById)
router.put('/:id', GuestController.edit)
router.delete('/:id', GuestController.delete)

module.exports = router
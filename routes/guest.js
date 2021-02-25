const router = require('express').Router()
const { GuestController } = require('../controllers')
const { authorizeGuest, uploadFile } = require('../middlewares')

router.post('/', GuestController.addGuest)
router.get('/', GuestController.findAllGuests)
router.get('/send', GuestController.sendEmail)
router.post('/upload', uploadFile.single('file'), GuestController.uploadGuest)
router.get('/:id', authorizeGuest, GuestController.findGuestById)
router.put('/:id', authorizeGuest, GuestController.updateGuest)
router.delete('/:id', authorizeGuest, GuestController.deleteGuest)

module.exports = router
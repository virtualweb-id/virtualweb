const router = require('express').Router()
const GuestController = require('../controllers/GuestController')
const { authorizeGuest, uploadFile } = require('../middlewares')

router.post('/', GuestController.create)
router.get('/', GuestController.findAll)
router.get('/send', GuestController.sendEmail)
router.post('/upload', uploadFile.single('file'), GuestController.uploadGuest)
router.get('/:id', authorizeGuest, GuestController.findById)
router.put('/:id', authorizeGuest, GuestController.edit)
router.delete('/:id', authorizeGuest, GuestController.delete)

module.exports = router
const router = require('express').Router()
const guest = require('./guestRoute')
const wedding = require('./weddingRoute')
const user = require('./userRoute')

router.use('/', user)
router.use('/guests', guest)
router.use('/wedding', wedding)

module.exports = router
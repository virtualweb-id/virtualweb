const router = require('express').Router()
const guest = require('./guest')

router.use(guest)

module.exports = router
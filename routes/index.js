const router = require('express').Router()
const guest = require('./guest')
const authRouter = require('./auth')

router.use('/', authRouter)
router.use('/guests', guest)

module.exports = router
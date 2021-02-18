const router = require('express').Router()
const guest = require('./guest')
const authRouter = require('./auth')
const { authentication } = require('../middlewares/auth')

router.use('/', authRouter)
router.use(authentication)
router.use('/guests', guest)

module.exports = router
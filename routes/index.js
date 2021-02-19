const router = require('express').Router()
const guestRouter = require('./guest')
const authRouter = require('./auth')
const weddingRouter = require('./wedding')
const { authentication } = require('../middlewares/auth')

router.use('/', authRouter)
router.use(authentication)
router.use('/guests', guestRouter)
router.use('/weddings', weddingRouter)

module.exports = router
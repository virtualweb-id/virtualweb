const router = require('express').Router()
const guestRouter = require('./guest')
const authRouter = require('./auth')
const weddingRouter = require('./wedding')
const commentRouter = require('./comment')
const { authentication } = require('../middlewares/auth')

router.use('/', authRouter)
router.use(authentication)
router.use('/guests', guestRouter)
router.use('/weddings', weddingRouter)
router.use('/comments', commentRouter)

module.exports = router
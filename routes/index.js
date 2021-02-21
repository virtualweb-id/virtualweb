const router = require('express').Router()
const guestRouter = require('./guest')
const authRouter = require('./auth')
const weddingRouter = require('./wedding')
const invitationRouter = require('./invitation')
const eventRouter = require('./invitationforguest')
const commentRouter = require('./comment')
const { authentication } = require('../middlewares/auth')

router.use('/', authRouter)
router.use('/events', eventRouter)
router.use('/comments', commentRouter)
router.use(authentication)
router.use('/guests', guestRouter)
router.use('/weddings', weddingRouter)
router.use('/invitations', invitationRouter)

module.exports = router
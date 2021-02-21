const router = require('express').Router()
const guestRouter = require('./guest')
const authRouter = require('./auth')
const weddingRouter = require('./wedding')
const invitationRouter = require('./invitation')
const commentRouter = require('./comment')
const { authentication } = require('../middlewares/auth')
const GuestController = require('../controllers/GuestController')

router.use('/', authRouter)
router.patch('/guests/:id', GuestController.sendStatus)
router.use(authentication)
router.use('/guests', guestRouter)
router.use('/weddings', weddingRouter)
router.use('/invitations', invitationRouter)
router.use('/comments', commentRouter)

module.exports = router
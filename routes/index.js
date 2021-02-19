const router = require('express').Router()
const guestRouter = require('./guest')
const authRouter = require('./auth')
const weddingRouter = require('./wedding')
<<<<<<< HEAD
const invitationRouter = require('./invitation')
=======
const commentRouter = require('./comment')
>>>>>>> 64daf588850216a82b5352203ebb2ebafb256a90
const { authentication } = require('../middlewares/auth')

router.use('/', authRouter)
router.use(authentication)
router.use('/guests', guestRouter)
router.use('/weddings', weddingRouter)
<<<<<<< HEAD
router.use('/invitations', invitationRouter)

=======
router.use('/comments', commentRouter)
>>>>>>> 64daf588850216a82b5352203ebb2ebafb256a90

module.exports = router
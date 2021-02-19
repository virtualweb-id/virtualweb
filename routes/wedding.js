const router = require('express').Router()
const WeddingController = require('../controllers/WeddingController')
const { authorizeWedding } = require('../middlewares/auth')

router.post('/', WeddingController.createWeddingPlan)
router.get('/', WeddingController.getWeddingInfoById)
router.use('/:id', authorizeWedding)
router.put('/:id', authorizeWedding, WeddingController.updateWeddingInfo)
router.delete('/:id', authorizeWedding, WeddingController.deleteWeddingPlan)

module.exports = router
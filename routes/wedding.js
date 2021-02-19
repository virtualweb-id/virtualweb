const WeddingController = require('../controllers/WeddingController')
const { authorizeWedding } = require('../middlewares/auth')

const router = require('express').Router()


router.post('/', WeddingController.createWeddingPlan)
router.get('/', WeddingController.getWeddingInfoById)
router.put('/:id', authorizeWedding, WeddingController.updateWeddingInfo)
router.delete('/:id', authorizeWedding, WeddingController.deleteWeddingPlan)

module.exports = router
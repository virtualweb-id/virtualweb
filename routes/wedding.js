const router = require('express').Router()
const { WeddingController } = require('../controllers')
const { authorizeWedding } = require('../middlewares')

router.post('/', WeddingController.createWeddingPlan)
router.get('/', WeddingController.getWeddingInfoById)
router.use('/:id', authorizeWedding)
router.put('/:id', authorizeWedding, WeddingController.updateWeddingPlan)
router.delete('/:id', authorizeWedding, WeddingController.deleteWeddingPlan)

module.exports = router
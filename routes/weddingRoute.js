const router = require('express').Router()
const WeddingController = require('../controllers/WeddingController')

router.get('/', WeddingController.getWeddingInfoById)
router.post('/', WeddingController.createWeddingPlan)
router.put('/:id', WeddingController.updateWeddingInfo)
router.delete('/:id', WeddingController.deleteWeddingPlan)

module.exports = router
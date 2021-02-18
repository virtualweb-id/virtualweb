const { Wedding } = require('../models')

class WeddingController {
  static async getWeddingInfoById(req, res, next) {
    try {
      const { id } = req.user
      const data = await Wedding.findByPk(id)
      res.status(200).json(data)
    } catch (error) {
      next(error)
    }
  }

  static async createWeddingPlan(req, res, next) {
    try {
      const newData = {
        title: req.body.title,
        date: req.body.date,
        address: req.body.address,
        groomName: req.body.groomName,
        brideName: req.body.brideName,
        groomImg: req.body.groomImg,
        brideImg: req.body.brideImg,
        status: req.body.status,
        UserId: req.user.id
      }
      const createWedding = Wedding.create(newData)
      res.status(201).json(createWedding)
    } catch (error) {
      next(error)
    }
  }

  static async updateWeddingInfo(req, res, next) {
    try {
      const { id } = req.user
      const editData = {
        title: req.body.title,
        date: req.body.date,
        address: req.body.address,
        groomName: req.body.groomName,
        brideName: req.body.brideName,
        groomImg: req.body.groomImg,
        brideImg: req.body.brideImg,
        status: req.body.status
      }
      const editedData = await Wedding.update(editData, {
        where: { id }, returning: true
      })
      res.status(200).json(editedData[1][0])
    } catch (error) {
      next(error)
    }
  }

  static async deleteWeddingPlan(req, res, next) {
    try {
      const { id } = req.params
      await Wedding.destroy({ where: { id } })
      res.status(200).json({ message: 'Wedding deleted' })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = WeddingController
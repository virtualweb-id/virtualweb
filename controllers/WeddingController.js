const { Wedding, Invitation } = require('../models')

class WeddingController {
  static async getWeddingInfoById(req, res, next) {
    try {
      const UserId = req.user.id
      const data = await Wedding.findByPk(UserId, {
        include: [Invitation]
      })
      res.status(200).json(data || {})
    } catch (error) {
      next(error)
    }
  }

  static async createWeddingPlan(req, res, next) {
    try {
      const UserId = req.user.id
      const { title, date, address, groomName, groomImg, brideImg, brideName, status } = req.body
      const newData = {
        id: Math.random() * 10e8 | 0,
        title: title || '',
        date: date || '',
        address: address || '',
        groomName: groomName || '',
        brideName: brideName || '',
        groomImg: groomImg || '',
        brideImg: brideImg || '',
        status: status || false,
        UserId
      }
      const createWedding = await Wedding.create(newData)
      if (createWedding) await Invitation.create({ WeddingId: createWedding.id })
      res.status(201).json(createWedding)
    } catch (error) {
      next(error)
    }
  }

  static async updateWeddingInfo(req, res, next) {
    try {
      const { id } = req.params
      const { title, date, address, groomName, groomImg, brideImg, brideName, status } = req.body
      const editData = {
        title: title || '',
        date: date || '',
        address: address || '',
        groomName: groomName || '',
        brideName: brideName || '',
        groomImg: groomImg || '',
        brideImg: brideImg || '',
        status: status || false
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
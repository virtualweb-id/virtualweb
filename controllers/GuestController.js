const { Guest, User, Wedding, Invitation } = require('../models')
const { sendToGuest } = require('../helpers')

class GuestController {
  static async findAll(req, res, next) {
    try {
      const UserId = req.user.id
      const guests = await Guest.findAll({
        order: [['createdAt', 'DESC']],
        where: { UserId }
      })
      res.status(200).json(guests)
    } catch (err) {
      next(err)
    }
  }

  static async findById(req, res, next) {
    try {
      const { id } = req.params
      const guest = await Guest.findByPk(id)
      res.status(200).json(guest)
    } catch (err) {
      next(err)
    }
  }

  static async sendEmail(req, res, next) {
    try {
      const UserId = req.user.id
      const guests = await Guest.findAll({
        order: [['createdAt', 'DESC']],
        where: { UserId }
      })
      const findWedding = await Wedding.findOne({ where: { UserId } })
      const findInvitation = await Invitation.findOne({ where: { WeddingId: findWedding.id } })
      const guestList = guests.filter(e => {
        return e.status === null
      })
      guestList.forEach(async (e) => {
        sendToGuest(e.name, e.email, e.id, findInvitation.id)
        await Guest.update({ status: false }, { where: { id: e.id } })
      })
      res.status(200).json(guestList)
    } catch (error) {
      next(error)
    }
  }

  static async create(req, res, next) {
    try {
      const UserId = req.user.id
      const { name, email, phoneNumber, status } = req.body
      const guest = await Guest.create({
        id: Math.random() * 10e8 | 0,
        name: name || '',
        email: email || '',
        phoneNumber: phoneNumber || '',
        status: status || null,
        UserId
      })
      res.status(201).json(guest)
    } catch (err) {
      next(err)
    }
  }

  static async edit(req, res, next) {
    try {
      const { id } = req.params
      const { name, email, phoneNumber } = req.body
      const guest = await Guest.update({
        name: name || '',
        email: email || '',
        phoneNumber: phoneNumber || '',
      }, {
        where: { id },
        returning: true
      })
      res.status(200).json(guest[1][0])
    } catch (err) {
      next(err)
    }
  }

  static async sendStatus(req, res, next) {
    try {
      const { id } = req.params
      const { status, email } = req.body
      const hasGuest = await Guest.findOne({ where: { id, email } })
      if (!hasGuest) {
        next({ name: "ErrorNotFound" })
      } else {
        const guest = await Guest.update({
          status
        }, {
          where: { id },
          returning: true
        })
        res.status(200).json(guest[1][0])
      }
    } catch (err) {
      next(err)
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params
      await Guest.destroy({ where: { id } })
      res.status(200).json({ message: 'Delete guest successful' })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = GuestController
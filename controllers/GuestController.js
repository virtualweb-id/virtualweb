const { Guest , Wedding} = require('../models')

class GuestController {
  static async findAll (req, res, next) {
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

  static async findById (req, res, next) {
    try {
      const { id } = req.params
      const guest = await Guest.findByPk(id)
      res.status(200).json(guest)
    } catch (err) {
      next(err)
    }        
  }

  static async create (req, res, next) {
    try {
      const UserId = req.user.id
      const { name, email, phoneNumber, status } = req.body
      const guest = await Guest.create({
        name: name || '', 
        email: email || '', 
        phoneNumber: phoneNumber || '', 
        status: status || false,
        UserId
      })
      res.status(201).json(guest)
    } catch (err) {
      next(err)
    }
  }

  static async edit (req, res, next) {
    try {
      const { id } = req.params
      const { name, email, phoneNumber } = req.body
      const guest = await Guest.update({
        name: name || '', 
        email: email || '', 
        phoneNumber: phoneNumber || '',
      }, {
        where: {id},
        returning: true
      })
      res.status(200).json(guest[1][0])
    } catch (err) {
      next(err)
    }
  }

  static async sendStatus (req, res, next) {
    try {
      const { id } = req.params
      const guest = await Guest.update({
        status: true,
      }, {
        where: {id},
        returning: true
      })
      res.status(200).json(guest[1][0])
    } catch (err) {
      next(err)
    }
  }

  static async delete (req, res, next) {
    try {
      const { id } = req.params
      await Guest.destroy({where: {id}})
      res.status(200).json({message: 'delete guest successfull'})
    } catch (err) {
      next(err)
    }
  }
}

module.exports = GuestController
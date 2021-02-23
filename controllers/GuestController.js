const { Guest, Wedding, Invitation } = require('../models')
const { sendToGuest, sendEventLink } = require('../helpers')
const readXlsxFile = require('read-excel-file/node')
const snap = require('../helpers/midtrans')

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
      const guestList = guests.filter(e => {
        return e.status === null
      })
      guestList.forEach(async (e) => {
        sendToGuest( 
          e.name,
          e.email,
          findWedding.brideName,
          findWedding.groomName,
          findWedding.date,
          e.id
        )
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
        const { email, UserId } = hasGuest
        const findWeds = await Wedding.findOne({ where: { UserId } })
        const findInvt = await Invitation.findOne({ where: { WeddingId: findWeds.id } })
        await sendEventLink(findWeds.brideName, findWeds.groomName, email, findInvt.id)
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

  static async uploadGuest(req, res, next) {
    try {
      const UserId = req.user.id
      let path = __basedir + '/uploads/' + req.file.filename;
      let data = [];
      const rows = await readXlsxFile(path)
      await rows.shift()
      for (let i = 0; i < rows.length; i++) {
        let datum = {
          id: Math.random() * 10e8 | 0,
          name: rows[i][0],
          email: rows[i][1],
          phoneNumber: rows[i][2],
          UserId
        }
        const filterGuest = await Guest.findOne({ where: { email: datum.email } })
        if (!filterGuest) data.push(datum)
      }
      if (data.length) {
        await Guest.bulkCreate(data)
        res.status(201).json({ message: 'uploaded' })
      } else {
        next({ name: 'EmptyFile' })
      }
    } catch (error) {
      next(error)
    }
  }
  
  static async payment(req, res, next) {
    const {inputData} = req.body
    try {
      let parameter = {
        "transaction_details": {
            "order_id": `${Math.ceil(Math.random()*9)}`,
            "gross_amount": +inputData.amount
        },
        "credit_card":{
            "secure" : true
        },
        "customer_details": {
            "first_name": inputData.firstName,
            "last_name": inputData.lastName,
            "email": inputData.email,
            "phone": inputData.phone
        }
      };
      const transaction = await snap.createTransaction(parameter)
      res.status(200).json({redirect_url: transaction.redirect_url});
    } catch (err) {
      next(err)
    }
  }
}

module.exports = GuestController
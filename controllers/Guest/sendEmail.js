const { Guest, Wedding } = require('../../models')
const { sendToGuest } = require('../../helpers')

module.exports = async (req, res, next) => {
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
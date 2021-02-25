const { Guest, Wedding, Invitation } = require('../../models')
const { sendEventLink } = require('../../helpers')

module.exports = async (req, res, next) => {
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
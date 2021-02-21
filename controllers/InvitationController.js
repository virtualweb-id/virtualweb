const { Wedding, Invitation, Comment } = require('../models')
const { cloudinary } = require('../helpers')

class InvitationController {
  static async showOne(req, res, next) {
    try {
      const UserId = req.user.id
      const { id: WeddingId } = await Wedding.findOne({ where: {UserId} })
      const invitation = await Invitation.findOne({ where: { WeddingId } })
      if (invitation) {
        res.status(200).json(invitation)
      } else {
        next({ name: 'ErrorNotFound' })
      }
    } catch (err) {
      next(err)
    }
  }

  static async showById (req, res, next) {
    try {
      const { id } = req.params
      const invitation = await Invitation.findOne({ where: { id }, include: [Wedding, Comment] })
      res.status(200).json(invitation)
    } catch (error) {
      next(error)
    }
  }

  static async edit(req, res, next) {
    try {
      const { id } = req.params
      const {
        brigeNickname, groomNickname, story,
        title, backgroundImg, additionalImg,
        videoUrl, backgroundColor, textColor,
        timeEvent1, timeEvent2, youtubeUrl
      } = req.body
      let uploadResponseBackgroundImg
      let uploadResponseAdditionalImg
      if (backgroundImg) {
        uploadResponseBackgroundImg = await cloudinary.uploader
        .upload(backgroundImg)
      }
      if (additionalImg) {
        uploadResponseAdditionalImg = await cloudinary.uploader
        .upload(additionalImg)
      }
      const input = {
        brigeNickname: brigeNickname || '',
        groomNickname: groomNickname || '',
        story: story || '',
        title: title || '',
        backgroundImg: (uploadResponseBackgroundImg ? uploadResponseBackgroundImg.url : ''),
        additionalImg: (uploadResponseAdditionalImg ? uploadResponseAdditionalImg.url : ''),
        videoUrl: videoUrl || '',
        backgroundColor: backgroundColor || '',
        textColor: textColor || '',
        timeEvent1: timeEvent1 || '',
        timeEvent2: timeEvent2 || '',
        youtubeUrl: youtubeUrl || ''
      }
      const invitation = await Invitation.update(input, {
        where: { id }, returning: true
      })
      res.status(200).json(invitation[1][0])
    } catch (err) {
      next(err)
    }
  }
}

module.exports = InvitationController
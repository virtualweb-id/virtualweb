const { Invitation } = require('../../models')
const { cloudinary } = require('../../helpers')

module.exports = async (req, res, next) => {
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
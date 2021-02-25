const { Wedding } = require('../../models')
const { cloudinary } = require('../../helpers')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, date, address, groomName, groomImg, brideImg, brideName, status } = req.body
    let uploadResponseGroom
    let uploadResponseBride
    if (groomImg) {
      uploadResponseGroom = await cloudinary.uploader
      .upload(groomImg)
    }
    if (brideImg) {
      uploadResponseBride = await cloudinary.uploader
        .upload(brideImg)
    }
    const editData = {
      title: title || '',
      date: date || '',
      address: address || '',
      groomName: groomName || '',
      brideName: brideName || '',
      groomImg: (uploadResponseGroom ? uploadResponseGroom.url : ''),
      brideImg: (uploadResponseBride ? uploadResponseBride.url : ''),
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
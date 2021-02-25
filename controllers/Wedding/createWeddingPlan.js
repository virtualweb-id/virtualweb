const { Invitation, Wedding } = require('../../models')
const { cloudinary } = require('../../helpers')

module.exports = async (req, res, next) => {
  try {
    const UserId = req.user.id
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
    const newData = {
      id: Math.random() * 10e8 | 0,
      title: title || '',
      date: date || '',
      address: address || '',
      groomName: groomName || '',
      brideName: brideName || '',
      groomImg: (uploadResponseGroom ? uploadResponseGroom.url : ''),
      brideImg: (uploadResponseBride ? uploadResponseBride.url : ''),
      status: status || false,
      UserId
    }
    const createWedding = await Wedding.create(newData)
    if (createWedding) await Invitation.create({ 
      id: Math.random() * 10e8 | 0,
      WeddingId: createWedding.id,
      brigeNickname: createWedding.brideName,
      groomNickname: createWedding.groomName,
      story: 'Your story here',
      title: 'Title',
      backgroundImg: 'https://wallpaperaccess.com/full/229801.jpg',
      additionalImg: 'https://wallpaperaccess.com/full/229801.jpg',
      backgroundColor: '#1687a7', 
      textColor: '#d3e0ea', 
      timeEvent1: '8.00', 
      timeEvent2: '11.00',  
    })
    res.status(201).json(createWedding)
  } catch (error) {
    next(error)
  }
}
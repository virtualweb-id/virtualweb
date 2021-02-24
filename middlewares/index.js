const { authentication, authorizeGuest, authorizeWedding, authorizeInvitation } = require('./auth')

module.exports = {
  authentication,
  authorizeGuest,
  authorizeWedding,
  authorizeInvitation,
  errorHandler: require('./errorHandler'),
  uploadFile: require('./multerHandler')
}
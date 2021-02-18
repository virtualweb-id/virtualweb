function errorHandler(err, req, res, next) {
  switch(err.name) {
    case 'InvalidPassOrEmail':
      res.status(404).json({message: 'Password or Email is not valid'})
      break
    case 'accessDenied':
      res.status(401).json({message: `You don't have access for this action`})
      break
    default: 
      console.log(err.name)
      res.status(500).json({message: 'internal server error'})
      break
  }
}

module.exports = errorHandler
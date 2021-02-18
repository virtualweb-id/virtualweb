const bcrypt = require('bcryptjs')

const hashPwd = plainPwd => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(plainPwd, salt)
  return hash
}

const comparePwd = (plainPwd, hashedPwd) => {
  const isMatching = bcrypt.compareSync(plainPwd, hashedPwd)
  return isMatching
}

module.exports = { hashPwd, comparePwd }

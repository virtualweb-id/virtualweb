const { Guest } = require('../../models')
const readXlsxFile = require('read-excel-file/node')

module.exports = async (req, res, next) => {
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

    if (!data.length) next({ name: 'EmptyFile' })
    else if (data.length !== rows.length) {
      await Guest.bulkCreate(data)
      res.status(201).json({ message: `Uploaded. But some were not uploaded because guest's email have been registered` })
    } else {
      await Guest.bulkCreate(data)
      res.status(201).json({ message: 'Success uploaded' })
    }
  } catch (error) {
    next(error)
  }
}
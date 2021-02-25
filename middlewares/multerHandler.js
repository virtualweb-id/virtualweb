const multer = require('multer');

const excelFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('excel') ||
    file.mimetype.includes('spreadsheetml')
  ) {
    cb(null, true);
  } else {
    cb('Please upload only excel file.', false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + '/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-uploads-${file.originalname}`); // format date pake moment biar bagus
  },
});

const uploadFile = multer({ storage: storage, fileFilter: excelFilter });

module.exports = uploadFile;
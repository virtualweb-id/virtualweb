const nodemailer = require('nodemailer')

function sendEmail(name, email) {
  const output = `
    <p>Register succeed!</p>
    <h3>Account details:</h3>
    <ul>
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
    </ul>
    <h3>Thanks for using Undanganku!</h3>
  `
  
  console.log(process.env.MAILER_EMAIL, process.env.MAILER_PASS, 'MASUK SINI')
  let transporter = nodemailer.createTransport({
    service: process.env.MAILER_PROVIDER,
    host: `${process.env.MAILER_PROVIDER}.com`,
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_EMAIL, // generated ethereal user
      pass: process.env.MAILER_PASS // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  })

  const mailOptions = {
    from: `"Undanganku" <${process.env.MAILER_PROVIDER}>`, // sender address
    to: `${email}`, // list of receivers
    subject: "Your Account Details", // Subject line
    html: output // html body
  }

  return transporter.sendMail(mailOptions)
}

module.exports = sendEmail
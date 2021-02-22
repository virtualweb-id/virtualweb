const nodemailer = require('nodemailer')
const contentMail = require('./mail')

const sendToUser = (name, email) => {
  const output = `
    <p>Register succeed!</p>
    <h3>Account details:</h3>
    <ul>
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
    </ul>
    <h3>Thanks for using Undanganku!</h3>
  `

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

const sendToGuest = (name, email, url1, url2) => {
  const baseUrl = 'http://localhost:3000'

  const output = contentMail(name, name, name, name, name, name)
  
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
    subject: `You're invited!`, // Subject line
    html: output // html body
  }

  return transporter.sendMail(mailOptions)
}



module.exports = { sendToUser, sendToGuest }
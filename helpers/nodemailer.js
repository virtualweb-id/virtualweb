const nodemailer = require('nodemailer')
const moment = require('moment')
const { guestConfirm, eventLink } = require('./nodemailer_template')

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

const sendToGuest = ( guest, guestEmail, bride, groom, date, guestId ) => {
  const baseUrl = 'https://undanganku-id.web.app'
  const formatDate = moment(date).format("dddd, MMMM Do, YYYY")
  const output = guestConfirm( guest, bride, groom, formatDate, baseUrl, guestId )
  
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
    to: `${guestEmail}`, // list of receivers
    subject: `You're invited!`, // Subject line
    html: output // html body
  }

  return transporter.sendMail(mailOptions)
}

const sendEventLink = ( brideName, groomName, guestEmail, invitationId ) => {
  const baseUrl = 'https://undanganku-id.web.app'
  const output = eventLink(brideName, groomName, baseUrl, invitationId)
  
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
    to: `${guestEmail}`, // list of receivers
    subject: `You're invited!`, // Subject line
    html: output // html body
  }

  return transporter.sendMail(mailOptions)
}


module.exports = { sendToUser, sendToGuest, sendEventLink }
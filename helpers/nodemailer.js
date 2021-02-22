const nodemailer = require('nodemailer')

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

  const output = `
    <p>Hi!</p>
    <h4>Account details:</h4>
    <h3>Your Guest ID: <b>${url1}</b></h3>
    <ul>
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
      <li>Confirm your attendance <a href="${baseUrl}/guestConfirmation">here.</a></li>
      <li>Link Nonton Nikah <a href="${baseUrl}/event/${url2}">here.</a></li>
    </ul>
    <h4>Thanks for using Undanganku!</h4>
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
    subject: `You're invited!`, // Subject line
    html: output // html body
  }

  return transporter.sendMail(mailOptions)
}



module.exports = { sendToUser, sendToGuest }
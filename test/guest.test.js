const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { hashPwd, generateToken } = require('../helpers')

const passTest = 'password'
const userTest = {
  name: 'Jamal',
  email: 'jamal@mail.com',
  password: hashPwd(passTest),
  phoneNumber: '72777777',
  createdAt: new Date(),
  updatedAt: new Date()
}
const otherUserTest = {
  name: 'Bambang',
  email: 'bambang@mail.com',
  password: hashPwd(passTest),
  phoneNumber: '27222222',
  createdAt: new Date(),
  updatedAt: new Date()
}
let addWeddingTest = {
  title: 'Nobita & Shizuka',
  date: '2021-02-26',
  address: 'Kyoto',
  groomName: 'Nobita',
  brideName: 'Shizuka',
  groomImg: 'img_url',
  brideImg: 'img_url',
  status: false,
  UserId: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}
let addGuestTest = {
  name: 'Giant',
  email: 'giantgendut@mail.com',
  phoneNumber: '081289272900',
  UserId: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}
let addOtherGuestTest = {
  name: 'Suneo',
  email: 'suneosombong@mail.com',
  phoneNumber: '081289272900',
  UserId: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}
let invitationTest = {
  WeddingId: 0,
  brigeNickname: '',
  groomNickname: '',
  story: "Your story here",
  title: "Title",
  backgroundColor: '#1687a7',
  textColor: '#d3e0ea',
  timeEvent1: '8.00',
  timeEvent2: '11.00',
  createdAt: new Date(),
  updatedAt: new Date()
}
let access_token
let wrong_access_token
let idGuest
let wrong_idGuest

beforeAll((done) => {
  jest.setTimeout(30000)
  queryInterface.bulkInsert('Users', [userTest], { returning: true })
    .then(user => {
      const { id, email } = user[0]
      access_token = generateToken({ id, email })
      wrong_access_token = generateToken({ id, email: 'hahaha@mail.com' })
      addWeddingTest.UserId = id
      return queryInterface.bulkInsert('Weddings', [addWeddingTest], { returning: true })
    })
    .then(weddings => {
      const { id, groomName, brideName, UserId } = weddings[0]
      idWeds = id
      addGuestTest.UserId = UserId
      invitationTest.WeddingId = id
      invitationTest.brigeNickname = brideName
      invitationTest.groomNickname = groomName
      return queryInterface.bulkInsert('Invitations', [ invitationTest ])
    })
    .then(() => {
      return queryInterface.bulkInsert('Guests', [addGuestTest], { returning: true })
    })
    .then(guests => {
      idGuest = guests[0].id
      return queryInterface.bulkInsert('Users', [otherUserTest], { returning: true })
    })
    .then(othUser => {
      addOtherGuestTest.UserId = othUser[0].id
      return queryInterface.bulkInsert('Guests', [addOtherGuestTest], { returning: true })
    })
    .then(othGuest => {
      wrong_idGuest = othGuest[0].id
      done()
    })
    .catch(err => done(err))
})

afterAll((done) => {
  queryInterface.bulkDelete('Users')
    .then(() => { return queryInterface.bulkDelete('Weddings') })
    .then(() => { return queryInterface.bulkDelete('Guests') })
    .then(() => done())
    .catch(err => done(err))
})

describe('POST /guest', () => {
  test('Case 1: Success add guest to the wedding', (done) => {
    request(app)
      .post('/guests')
      .set('access_token', access_token)
      .send({
        name: 'Giant',
        email: 'giantgendut@mail.com',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(201)
        expect(body).toHaveProperty('name', 'Giant')
        done()
      })
  })

    test('Case 2: Wrong access token', (done) => {
    request(app)
      .post('/guests')
      .set('access_token', wrong_access_token)
      .send({
        name: 'Giant',
        email: 'giantgendut@mail.com',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthenticate')
        expect(body).toHaveProperty('message', 'You need to login first')
        done()
      })
  })

  test(`Case 3: Don't have access token`, (done) => {
    request(app)
      .post('/guests')
      .send({
        name: 'Giant',
        email: 'giantgendut@mail.com',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(403)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAccessToken')
        expect(body).toHaveProperty('message', 'Jwt needed')
        done()
      })
  })

  test('Case 4: Bad request: blank name', (done) => {
    request(app)
      .post('/guests')
      .set('access_token', access_token)
      .send({
        name: '',
        email: 'giantgendut@mail.com',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', ['Name is required'])
        done()
      })
  })

  test('Case 5: Bad request: blank email', (done) => {
    request(app)
      .post('/guests')
      .set('access_token', access_token)
      .send({
        name: 'Giant',
        email: '',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', ['Email is required'])
        done()
      })
  })

  test('Case 6: Bad request: blank phone number', (done) => {
    request(app)
      .post('/guests')
      .set('access_token', access_token)
      .send({
        name: 'Giant',
        email: 'giantgendut@mail.com',
        phoneNumber: ''
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', ['Phone number is required'])
        done()
      })
  })

  test(`Case 7: Bad request; all field's are blank`, (done) => {
    request(app)
      .post('/guests')
      .set('access_token', access_token)
      .send({
        name: '',
        email: '',
        phoneNumber: ''
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body.message).toEqual(expect.arrayContaining([
          'Name is required',
          'Email is required',
          'Phone number is required'
        ]))
        done()
      })
  })

  test('Case 8: Database error', (done) => {
    request(app)
      .post('/guests')
      .set('access_token', access_token)
      .send({
        name: 'Giantlllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllllll',
        email: 'giantgendut@mail.com',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(500)
        expect(body).toHaveProperty('status', 'Error')
        expect(body.error).toHaveProperty('name', 'SequelizeDatabaseError')
        done()
      })
  })
})

describe('POST /guests/upload', () => {
  const filePath = `${__dirname}/testFiles/template.xlsx`
  const othFilePath = `${__dirname}/testFiles/template2.xlsx`
  const blankFilePath = `${__dirname}/testFiles/blank.xlsx`
  const wrongFile = `${__dirname}/testFiles/dummy.jpg`

  test('Case 1: Success upload all data in excel file', (done) => {
    request(app)
      .post('/guests/upload')
      .set('access_token', access_token)
      .attach('file', filePath)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(201)
        expect(body).toHaveProperty('message', 'Success uploaded')
        done()
      })      
  })

  test('Case 2: Some data was uploaded', (done) => {
    request(app)
      .post('/guests/upload')
      .set('access_token', access_token)
      .attach('file', othFilePath)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(201)
        expect(body).toHaveProperty('message', `Uploaded. But some were not uploaded because guest's email have been registered`)
        done()
      })      
  })

  test('Case 3: File was empty', (done) => {
    request(app)
      .post('/guests/upload')
      .set('access_token', access_token)
      .attach('file', blankFilePath)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'EmptyFile')
        expect(body).toHaveProperty('message', 'All emails have been registered')
        done()
      })      
  })

  test('Case 4: Wrong access token', (done) => {
    request(app)
      .post('/guests/upload')
      .set('access_token', wrong_access_token)
      .attach('file', filePath)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthenticate')
        expect(body).toHaveProperty('message', 'You need to login first')
        done()
      })      
  })

  test('Case 5: Wrong file format', (done) => {
    request(app)
      .post('/guests/upload')
      .set('access_token', access_token)
      .attach('file', wrongFile)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(500)
        done()
      })      
  })

  test('Case 6: Bad request; send a body not a file', (done) => {
    request(app)
      .post('/guests/upload')
      .set('access_token', access_token)
      .send('file', 'aaaaaaa')
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(500)
        expect(body).toHaveProperty('status', 'Error')
        done()
      })      
  })
})

describe('GET /guests', () => {
  test('Case 1: Success get all guest info', (done) => {
    request(app)
      .get('/guests')
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toEqual(expect.arrayContaining([]))
        done()
      })
  })

  test('Case 2: Wrong access token', (done) => {
    request(app)
      .get('/guests')
      .set('access_token', wrong_access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthenticate')
        expect(body).toHaveProperty('message', 'You need to login first')
        done()
      })
  })

  test(`Case 3: Don't have access token`, (done) => {
    request(app)
      .get('/guests')
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(403)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAccessToken')
        expect(body).toHaveProperty('message', 'Jwt needed')
        done()
      })
  })

  test('Case 4: Access token malformed', (done) => {
    request(app)
      .get('/guests')
      .set('access_token', 'access_token')
      .end((err, res) => {
        const { status, body } = res
        if (err) return done(err)
        expect(status).toBe(500)
        expect(body.error).toHaveProperty('message', 'jwt malformed')
        done()
      })
  })
})

describe('GET /guests/send', () => {
  test('Case 1: Success send email to all guest', (done) => {
    request(app)
      .get('/guests/send')
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toEqual(expect.arrayContaining([]))
        done()
      })
  })

  test('Case 2: Wrong access token', (done) => {
    request(app)
      .get('/guests/send')
      .set('access_token', wrong_access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthenticate')
        expect(body).toHaveProperty('message', 'You need to login first')
        done()
      })
  })

  test(`Case 3: Don't have access token`, (done) => {
    request(app)
      .get('/guests/send')
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(403)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAccessToken')
        expect(body).toHaveProperty('message', 'Jwt needed')
        done()
      })
  })
})

describe('GET /guests/:id', () => {
  test('Case 1: Success get guest info', (done) => {
    request(app)
      .get(`/guests/${idGuest}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toEqual(expect.arrayContaining([]))
        done()
      })
  })

  test('Case 2: Wrong access token', (done) => {
    request(app)
      .get(`/guests/${idGuest}`)
      .set('access_token', wrong_access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthenticate')
        expect(body).toHaveProperty('message', 'You need to login first')
        done()
      })
  })

  test(`Case 3: Don't have access token`, (done) => {
    request(app)
      .get(`/guests/${idGuest}`)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(403)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAccessToken')
        expect(body).toHaveProperty('message', 'Jwt needed')
        done()
      })
  })

  test('Case 4: Wrong guest ID (Different User ID)', done => {
    request(app)
      .get(`/guests/${wrong_idGuest}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(403)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthorize')
        expect(body).toHaveProperty('message', 'You dont have access')
        done()
      })
  })

  test('Case 5: Guest ID not found', done => {
    request(app)
      .get(`/guests/${idGuest + 5}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(404)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorNotFound')
        expect(body).toHaveProperty('message', 'Not found')
        done()
      })
  })
})

describe('PUT /guests/:id', () => {
  test('Case 1: Success update guest info', (done) => {
    request(app)
      .put(`/guests/${idGuest}`)
      .set('access_token', access_token)
      .send({
        name: 'Dekisugi',
        email: 'dekisugi@mail.com',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toEqual(expect.arrayContaining([]))
        done()
      })
  })

  test('Case 2: Wrong access token', (done) => {
    request(app)
      .put(`/guests/${idGuest}`)
      .set('access_token', wrong_access_token)
      .send({
        name: 'Suneo',
        email: 'suneosombong@mail.com',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthenticate')
        expect(body).toHaveProperty('message', 'You need to login first')
        done()
      })
  })

  test(`Case 3: Don't have access token`, (done) => {
    request(app)
      .put(`/guests/${idGuest}`)
      .send({
        name: 'Suneo',
        email: 'suneosombong@mail.com',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(403)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAccessToken')
        expect(body).toHaveProperty('message', 'Jwt needed')
        done()
      })
  })

  test('Case 4: Wrong guest ID (Different User ID)', (done) => {
    request(app)
      .put(`/guests/${wrong_idGuest}`)
      .set('access_token', access_token)
      .send({
        name: 'Suneo',
        email: 'suneosombong@mail.com',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(403)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthorize')
        expect(body).toHaveProperty('message', 'You dont have access')
        done()
      })
  })

  test('Case 5: Guest ID not found', (done) => {
    request(app)
      .put(`/guests/${idGuest + 5}`)
      .set('access_token', access_token)
      .send({
        name: 'Suneo',
        email: 'suneosombong@mail.com',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(404)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorNotFound')
        expect(body).toHaveProperty('message', 'Not found')
        done()
      })
  })

  test('Case 6: Database error', (done) => {
    request(app)
      .put(`/guests/${idGuest}`)
      .set('access_token', access_token)
      .send({
        name: 'Dekisugiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
        email: 'dekisugi@mail.com',
        phoneNumber: '081289272900'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(500)
        expect(body).toHaveProperty('status', 'Error')
        expect(body.error).toHaveProperty('name', 'SequelizeDatabaseError')
        done()
      })
  })
})

describe('PATCH /guests/:id', () => {
  test(`Case 1: Success update guest's status`, (done) => {
    request(app)
      .patch(`/guests/${idGuest}`)
      .send({
        status: true,
        email: 'dekisugi@mail.com'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('status', true)
        done()
      })
  })

  test('Case 2: Wrong guest ID (Different invitation)', (done) => {
    request(app)
      .patch(`/guests/${wrong_idGuest}`)
      .send({
        status: true,
        email: 'giantgendut@mail.com'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(404)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorNotFound')
        expect(body).toHaveProperty('message', 'Not found')
        done()
      })
  })

  test(`Case 3: Database error`, (done) => {
    request(app)
      .patch(`/guests/${idGuest}`)
      .send({
        status: 'hahahay',
        email: 'dekisugi@mail.com'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(500)
        expect(body.error).toHaveProperty('name', 'SequelizeDatabaseError')
        done()
      })
  })
})

describe('DELETE /guests/:id', () => {
  test('Case 1: Success delete guest info', (done) => {
    request(app)
      .delete(`/guests/${idGuest}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('message', 'Delete guest successful')
        done()
      })
  })

  test('Case 2: Wrong access token', (done) => {
    request(app)
      .delete(`/guests/${idGuest}`)
      .set('access_token', wrong_access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthenticate')
        expect(body).toHaveProperty('message', 'You need to login first')
        done()
      })
  })

  test(`Case 3: Don't have access token`, (done) => {
    request(app)
      .delete(`/guests/${idGuest}`)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(403)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAccessToken')
        expect(body).toHaveProperty('message', 'Jwt needed')
        done()
      })
  })

  test('Case 4: Wrong guest ID (Different User ID)', (done) => {
    request(app)
      .delete(`/guests/${wrong_idGuest}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(403)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthorize')
        expect(body).toHaveProperty('message', 'You dont have access')
        done()
      })
  })

  test('Case 5: Guest ID not found', (done) => {
    request(app)
      .delete(`/guests/${idGuest + 5}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(404)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorNotFound')
        expect(body).toHaveProperty('message', 'Not found')
        done()
      })
  })
})

describe('POST /guests/payment', () => {
  test('Case 1: Midtrans error', (done) => {
    request(app)
      .post('/guests/payment')
      .send({
        firstName: 'Naruto',
        lastName: 'Sasuke',
        email: 'naruke@mail.com',
        phone: '727727727',
        amount: 250000
      })
      .end((err, res) => {
        if (err) return done(err)
        const { status } = res
        expect(status).toBe(500)// snap suka error, harusnya success
        done()
      })
  })
})
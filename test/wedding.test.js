const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { hashPwd, generateToken } = require('../helpers')
const dummy = 'https://www.faitron.com/wp-content/uploads/2018/08/dummy.jpg'

const passTest = 'password'
const userTest = {
  name: 'Heykal',
  email: 'heykal@mail.com',
  password: hashPwd(passTest),
  phoneNumber: '72777777',
  createdAt: new Date(),
  updatedAt: new Date()
}
let otherUserTest = {
  name: 'Rafli',
  email: 'rafli@mail.com',
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
  groomImg: dummy,
  brideImg: dummy,
  status: false,
  UserId: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}
let addOtherWeddingTest = {
  title: 'Suneo & Maimunah',
  date: '2021-02-28',
  address: 'Tokyo',
  groomName: 'Suneo',
  brideName: 'Maimunah',
  groomImg: dummy,
  brideImg: dummy,
  status: false,
  UserId: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}
let access_token
let wrong_access_token
let idWeds
let wrong_idWeds

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
      idWeds = weddings[0].id
      return queryInterface.bulkInsert('Users', [ otherUserTest ], { returning: true })
    })
    .then(othUser => {
      addOtherWeddingTest.UserId = othUser[0].id
      return queryInterface.bulkInsert('Weddings', [ addOtherWeddingTest ], { returning: true })
    })
    .then(othWeds => {
      wrong_idWeds = othWeds[0].id
      done()
    })
    .catch(err => done(err))
})

afterAll((done) => {
  queryInterface.bulkDelete('Users')
    .then(() => { return queryInterface.bulkDelete('Weddings') })
    .then(() => done())
    .catch(err => done(err))
})

describe('POST /weddings', () => {
  test('Case 1: Create wedding plan', (done) => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(201)
        expect(body).toHaveProperty('groomName', 'Nobita')
        done()
      })
  })

  test('Case 2: Wrong access token', (done) => {
    request(app)
      .post('/weddings')
      .set('access_token', wrong_access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
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

  test(`Case 3: Don't have access token, so can't have User ID`, (done) => {
    request(app)
      .post('/weddings')
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
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

  test('Case 4: Bad request; blank title', (done) => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: '',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', ['Title is required'])
        done()
      })
  })

  test('Case 5: Bad request; blank date', (done) => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        done()
      })
  })

  test('Case 6: Bad request; date must be greater than today', (done) => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2020-11-05',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', ['Please choose the date wisely. It must be greater than today'])
        done()
      })
  })

  test('Case 7: Bad request; blank address', (done) => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: '',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', ['Address is required'])
        done()
      })
  })

  test('Case 8: Bad request; blank groom name', (done) => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: '',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', [`Groom's Name is required`])
        done()
      })
  })

  test('Case 9: Bad request; blank bride name', (done) => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: '',
        groomImg: dummy,
        brideImg: dummy,
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', [`Bride's Name is required`])
        done()
      })
  })

  test(`Case 10: Bad request; blank groom's photo`, (done) => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: '',
        brideImg: dummy,
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', [`Groom's Photo is required`])
        done()
      })
  })

  test(`Case 11: Bad request; blank bride's photo`, (done) => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: '',
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', [`Bride's Photo is required`])
        done()
      })
  })

  test(`Case 12: Bad request; all field's are blank`, (done) => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: '',
        date: '',
        address: '',
        groomName: '',
        brideName: '',
        groomImg: '',
        brideImg: '',
        status: ''
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body.message).toEqual(expect.arrayContaining([
          'Title is required',
          'Date is required',
          'Address is required',
          `Groom's Name is required`,
          `Bride's Name is required`,
          `Groom's Photo is required`,
          `Bride's Photo is required`
        ]))
        done()
      })
  })
})

describe('GET /weddings', () => {
  test(`Case 1: Success get wedding's info`, (done) => {
    request(app)
      .get('/weddings')
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toEqual(expect.arrayContaining([]))
        done()
      })
  })

  test(`Case 2: Wrong access token`, (done) => {
    request(app)
      .get('/weddings')
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
      .get('/weddings')
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

describe('PUT /weddings/:id', () => {
  test('Case 1: Success update wedding info (date)', (done) => {
    request(app)
      .put(`/weddings/${idWeds}`)
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-28',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('date')
        done()
      })
  })

  test('Case 2: Wrong access token', (done) => {
    request(app)
      .put(`/weddings/${idWeds}`)
      .set('access_token', wrong_access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-28',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
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
      .put(`/weddings/${idWeds}`)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-28',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
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

  test('Case 4: Wrong wedding ID (Different User ID)', (done) => {
    request(app)
      .put(`/weddings/${wrong_idWeds}`)
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-28',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
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

  test(`Case 5: Wedding ID not found`, (done) => {
    request(app)
      .put(`/weddings/${idWeds + 5}`)
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-28',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
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
      .put(`/weddings/${idWeds}`)
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizukaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        date: '2021-02-28',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: dummy,
        brideImg: dummy,
        status: false
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

describe('DELETE /weddings/:id', () => {
  test('Case 1: Success delete wedding info', (done) => {
    request(app)
      .delete(`/weddings/${idWeds}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('message', 'Wedding deleted')
        done()
      })
  })

  test('Case 2: Wrong access token', (done) => {
    request(app)
      .delete(`/weddings/${idWeds}`)
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
      .delete(`/weddings/${idWeds}`)
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

  test('Case 4: Wrong wedding ID (Different User ID)', (done) => {
    request(app)
      .delete(`/weddings/${wrong_idWeds}`)
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

  test('Case 5: Wedding ID not found', (done) => {
    request(app)
      .delete(`/weddings/${idWeds + 5}`)
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
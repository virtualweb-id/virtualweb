const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { hashPwd } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')

const passTest = 'shizukaku'
const userTest = {
  name: 'Nobita',
  email: 'nobitamu@mail.com',
  password: hashPwd(passTest),
  phoneNumber: '72777777',
  createdAt: new Date(),
  updatedAt: new Date()
}
let access_token
let wrong_access_token

beforeAll(done => {
  queryInterface.bulkInsert('Users', [userTest], { returning: true })
    .then(user => {
      const { id, email } = user[0]
      access_token = generateToken({ id, email })
      wrong_access_token = generateToken({ id, email: 'hahaha@mail.com' })
      done()
    })
    .catch(err => done(err))
})

afterAll(done => {
  queryInterface.bulkDelete('Users')
    .then(() => done())
    .catch(err => done(err))
})

describe('POST /weddings', () => {
  test('Case 1: Create wedding plan', done => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: 'img_url',
        brideImg: 'img_url',
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

  test('Case 2: Wrong access token', done => {
    request(app)
      .post('/weddings')
      .set('access_token', wrong_access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: 'img_url',
        brideImg: 'img_url',
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthenticate')
        expect(body).toHaveProperty('message', 'you need to login first')
        done()
      })
  })

  test(`Case 3: Don't have access token, so can't have User ID`, done => {
    request(app)
      .post('/weddings')
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: 'img_url',
        brideImg: 'img_url',
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(500)
        expect(body).toHaveProperty('status', 'Error')
        expect(body.error).toHaveProperty('name', 'JsonWebTokenError')
        expect(body.error).toHaveProperty('message', 'jwt must be provided')
        done()
      })
  })

  test('Case 4: Bad request; blank title', done => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: '',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: 'img_url',
        brideImg: 'img_url',
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

  test('Case 5: Bad request; blank date', done => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: 'img_url',
        brideImg: 'img_url',
        status: false
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', ['Date is required'])
        done()
      })
  })

  test('Case 6: Bad request; date must be greater than today', done => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2020-11-05',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: 'img_url',
        brideImg: 'img_url',
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

  test('Case 7: Bad request; blank address', done => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: '',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: 'img_url',
        brideImg: 'img_url',
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

  test('Case 8: Bad request; blank groom name', done => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: '',
        brideName: 'Shizuka',
        groomImg: 'img_url',
        brideImg: 'img_url',
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

  test('Case 9: Bad request; blank bride name', done => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: '',
        groomImg: 'img_url',
        brideImg: 'img_url',
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

  test(`Case 10: Bad request; blank groom's photo`, done => {
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
        brideImg: 'img_url',
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

  test(`Case 11: Bad request; blank bride's photo`, done => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: 'img_url',
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

  test(`Case 12: Bad request; blank groom's photo`, done => {
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
        brideImg: 'img_url',
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

  test('Case 13: Bad request; blank status', done => {
    request(app)
      .post('/weddings')
      .set('access_token', access_token)
      .send({
        title: 'Nobita & Shizuka',
        date: '2021-02-26',
        address: 'Kyoto',
        groomName: 'Nobita',
        brideName: 'Shizuka',
        groomImg: 'img_url',
        brideImg: 'img_url',
        status: ''
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', ['Status is required'])
        done()
      })
  })

  test(`Case 14: Bad request; all field's are blank`, done => {
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
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body.message).toEqual(expect.arrayContaining([
          'Title is required',
          'Date is required',
          'Address is required',
          `Groom's Name is required`,
          `Bride's Name is required`,
          `Groom's Photo is required`,
          `Bride's Photo is required`,
          'Status is required'
        ]))
        done()
      })
  })
})

describe('GET /weddings', () => {
  test(`Case 1: Success get wedding's info`, done => {
    request(app)
      .get('/weddings')
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        console.log(body, '<<< INI TESTING')
        expect(status).toBe(200)
        expect(body).toEqual(expect.arrayContaining([]))
        done()
      })
  })
})
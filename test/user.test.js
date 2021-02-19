const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { hashPwd } = require('../helpers/bcrypt')

const passTest = 'shizukaku'
const userTest = {
  name: 'Nobita',
  email: 'nobitamu@mail.com',
  password: hashPwd(passTest),
  phoneNumber: '72777777',
  createdAt: new Date(),
  updatedAt: new Date()
}

beforeAll(done => {
  queryInterface.bulkInsert('Users', [ userTest ], { returning: true })
    .then(() => done())
    .catch(err => done(err))
})

afterAll(done => {
  queryInterface.bulkDelete('Users')
    .then(() => done())
    .catch(err => done(err))
})

describe('POST /login', () => {
  test('Case 1: Success sign in', done => {
    request(app)
      .post('/login')
      .send({ email: userTest.email, password: passTest })
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(200)
        expect(body).toHaveProperty('access_token', expect.any(String))
        done()
      })
  })

  test('Case 2: Invalid email', done => {
    request(app)
      .post('/login')
      .send({ email: userTest.email, password: 'hahaha' })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'InvalidPassOrEmail')
        expect(body).toHaveProperty('message', 'wrong email / password')
        done()
      })
  })

  test('Case 3: Invalid password', done => {
    request(app)
      .post('/login')
      .send({ email: 'hahaha@mail.com', password: passTest })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'InvalidPassOrEmail')
        expect(body).toHaveProperty('message', 'wrong email / password')
        done()
      })
  })

  test('Case 4: Blank email', done => {
    request(app)
      .post('/login')
      .send({ email: '', password: passTest })
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'InvalidPassOrEmail')
        expect(body).toHaveProperty('message', 'wrong email / password')
        done()
      })
  })

  test('Case 5: Blank password', done => {
    request(app)
      .post('/login')
      .send({ email: userTest.email, password: '' })
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'InvalidPassOrEmail')
        expect(body).toHaveProperty('message', 'wrong email / password')
        done()
      })
  })

  test('Case 6: Blank email & password', done => {
    request(app)
      .post('/login')
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(401)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'InvalidPassOrEmail')
        expect(body).toHaveProperty('message', 'wrong email / password')
        done()
      })
  })
})
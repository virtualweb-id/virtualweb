const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { hashPwd } = require('../helpers')

const passTest = 'password'
const userTest = {
  name: 'Reyhan',
  email: 'reyhan@mail.com',
  password: hashPwd(passTest),
  phoneNumber: '72777777',
  createdAt: new Date(),
  updatedAt: new Date()
}

beforeAll(done => {
  queryInterface.bulkInsert('Users', [ userTest ])
    .then(() => done())
    .catch(err => done(err))
})

afterAll(done => {
  queryInterface.bulkDelete('Users')
    .then(() => done())
    .catch(err => done(err))
})

describe('POST /register', () => {
  test('Case 1: Success sign up', done => {
    request(app)
      .post('/register')
      .send({ name: 'Shizuka', email: 'shizukamu@mail.com', password: hashPwd('nobitaku'), phoneNumber: '27222222' })
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(201)
        expect(body).toHaveProperty('id', expect.any(Number))
        expect(body).toHaveProperty('name', 'Shizuka')
        expect(body).toHaveProperty('email', 'shizukamu@mail.com')
        expect(body).toHaveProperty('phoneNumber', '27222222')
        done()
      })
  })

  test('Case 2: Email has been registered', done => {
    request(app)
      .post('/register')
      .send({ name: 'Shizuka', email: 'shizukamu@mail.com', password: hashPwd('nobitaku'), phoneNumber: '27222222' })
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeUniqueConstraintError')
        expect(body.message).toEqual(expect.arrayContaining(['email must be unique']))
        done()
      })
  })

  test('Case 3: Blank name', done => {
    request(app)
      .post('/register')
      .send({ name: '', email: 'shizukamu@mail.com', password: hashPwd('nobitaku'), phoneNumber: '27222222' })
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body).toHaveProperty('message', ['Name is required'])
        done()
      })
  })

  test('Case 4: Blank email', done => {
    request(app)
      .post('/register')
      .send({ name: 'Shizuka', email: '', password: hashPwd('nobitaku'), phoneNumber: '27222222' })
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body.message).toEqual(expect.arrayContaining([
          'Email/password is not valid',
          'Email is required'
        ]))
        done()
      })
  })

  test('Case 5: Blank password', done => {
    request(app)
      .post('/register')
      .send({ name: 'Shizuka', email: 'shizukamu@mail.com', password: '', phoneNumber: '27222222' })
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body.message).toEqual(expect.arrayContaining([
          'Password must be at least 5 characters',
          'Password is required'
        ]))
        done()
      })
  })

  test('Case 6: Blank phone number', done => {
    request(app)
      .post('/register')
      .send({ name: 'Shizuka', email: 'shizukamu@mail.com', password: hashPwd('nobitaku'), phoneNumber: '' })
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body.message).toEqual(expect.arrayContaining([ 'Phone number is required' ]))
        done()
      })
  })

  test('Case 7: Blank name, email, password, & phone number', done => {
    request(app)
      .post('/register')
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeValidationError')
        expect(body.message).toEqual(expect.arrayContaining([
          'Name is required',
          'Email is required',
          'Password is required',
          'Phone number is required'
        ]))
        done()
      })
  })
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
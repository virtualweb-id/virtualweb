const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { hashPwd } = require('../helpers/bcrypt')

let userTest = {
  name: 'Nobita',
  email: 'nobitaku@mail.com',
  password: hashPwd
}

beforeAll(done => {
  const adminTester = [
    {
      email: 'admin@mail.com',
      password: hashPwd(passwordTester),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
  queryInterface.bulkInsert('Users', adminTester, { returning: true })
    .then(user => {
      emailTester = user[0].email
      done()
    })
    .catch(err => done(err))
})

afterAll(done => {
  queryInterface.bulkDelete('Users')
    .then(() => done())
    .catch(err => done(err))
})

describe('POST /admin/signin', () => {
  test('Case 1: Success sign in', done => {
    request(app)
      .post('/admin/signin')
      .send({ email: emailTester, password: passwordTester })
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(200)
        expect(body).toHaveProperty('access_token', expect.any(String))
        done()
      })
  })

  test('Case 2: Invalid account', done => {
    request(app)
      .post('/admin/signin')
      .send({ email: 'hahaha@mail.com', password: passwordTester })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(404)
        expect(body).toHaveProperty('message', 'Invalid account')
        done()
      })
  })

  test('Case 3: Invalid email/password', done => {
    request(app)
      .post('/admin/signin')
      .send({ email: emailTester, password: 'hahaha' })
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(400)
        expect(body).toHaveProperty('message', 'Invalid email/password')
        done()
      })
  })

  test('Case 4: Blank email & password', done => {
    request(app)
      .post('/admin/signin')
      .end((err, res) => {
        const { body, status } = res
        if (err) return done(err)
        expect(status).toBe(500)
        expect(body).toHaveProperty('message', 'Internal server error')
        done()
      })
  })
})
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
  status: false,
  UserId: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}
let addOtherGuestTest = {
  name: 'Suneo',
  email: 'suneosombong@mail.com',
  phoneNumber: '081289272900',
  status: false,
  UserId: 0,
  createdAt: new Date(),
  updatedAt: new Date()
}
let access_token
let wrong_access_token
let idGuest
let wrong_idGuest
let idWeds

beforeAll(done => {
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
      addGuestTest.UserId = weddings[0].UserId
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

afterAll(done => {
  queryInterface.bulkDelete('Users')
    .then(() => { return queryInterface.bulkDelete('Weddings') })
    .then(() => { return queryInterface.bulkDelete('Guests') })
    .then(() => done())
    .catch(err => done(err))
})

describe('POST /guest', () => {
  test('Case 1: Success add guest to the wedding', done => {
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

  test('Case 2: Wrong access token', done => {
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
        expect(body).toHaveProperty('message', 'you need to login first')
        done()
      })
  })

  test(`Case 3: Don't have access token`, done => {
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

  test('Case 4: Bad request: blank name', done => {
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

  test('Case 5: Bad request: blank email', done => {
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

  test('Case 6: Bad request: blank phone number', done => {
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

  test(`Case 7: Bad request; all field's are blank`, done => {
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
})

describe('GET /guests', () => {
  test('Case 1: Success get all guest info', done => {
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

  test('Case 2: Wrong access token', done => {
    request(app)
      .get('/guests')
      .set('access_token', wrong_access_token)
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

  test("response with internal server error", (done) => {
    request(app)
      .get("/guests")
      .set("access_token", "access_token")
      .end((err, res) => {
        const { status, body } = res
        if (err) return done(err)
        expect(status).toBe(500)
        expect(body.error).toHaveProperty("message", "jwt malformed")
        done()
      })
  })

  test(`Case 3: Don't have access token`, done => {
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
})

describe('GET /guests/:id', () => {
  test('Case 1: Success get guest info', done => {
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

  test('Case 2: Wrong access token', done => {
    request(app)
      .get(`/guests/${idGuest}`)
      .set('access_token', wrong_access_token)
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

  test(`Case 3: Don't have access token`, done => {
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
        expect(body).toHaveProperty('message', 'you dont have access')
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
        expect(body).toHaveProperty('message', 'not found')
        done()
      })
  })
})

describe('PUT /guests/:id', () => {
  test('Case 1: Success update guest info', done => {
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

  test('Case 2: Wrong access token', done => {
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
        expect(body).toHaveProperty('message', 'you need to login first')
        done()
      })
  })

  test(`Case 3: Don't have access token`, done => {
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

  test('Case 4: Wrong guest ID (Different User ID)', done => {
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
        expect(body).toHaveProperty('message', 'you dont have access')
        done()
      })
  })

  test('Case 5: Guest ID not found', done => {
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
        expect(body).toHaveProperty('message', 'not found')
        done()
      })
  })
})

describe('PATCH /guests/:id', () => {
  test(`Case 1: Success update guest's status`, done => {
    request(app)
      .patch(`/guests/${idGuest}`)
      .send({
        status: true,
        email: 'dekisugi@mail.com'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        console.log(idGuest)
        expect(status).toBe(200)
        expect(body).toHaveProperty('status', true)
        done()
      })
  })

  test('Case 2: Wrong guest ID (Different invitation)', done => {
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
        expect(body).toHaveProperty('message', 'not found')
        done()
      })
  })

  // test('Case 3: M', done => {
  //   request(app)
  //     .patch(`/guests/${idGuest + 5}`)
  //     .set('access_token', access_token)
  //     .end((err, res) => {
  //       if (err) return done(err)
  //       const { body, status } = res
  //       expect(status).toBe(404)
  //       expect(body).toHaveProperty('status', 'Error')
  //       expect(body).toHaveProperty('name', 'ErrorNotFound')
  //       expect(body).toHaveProperty('message', 'not found')
  //       done()
  //     })
  // })
})

describe('DELETE /guests/:id', () => {
  test('Case 1: Success delete guest info', done => {
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

  test('Case 2: Wrong access token', done => {
    request(app)
      .delete(`/guests/${idGuest}`)
      .set('access_token', wrong_access_token)
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

  test(`Case 3: Don't have access token`, done => {
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

  test('Case 4: Wrong guest ID (Different User ID)', done => {
    request(app)
      .delete(`/guests/${wrong_idGuest}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(403)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorAuthorize')
        expect(body).toHaveProperty('message', 'you dont have access')
        done()
      })
  })

  test('Case 5: Guest ID not found', done => {
    request(app)
      .delete(`/guests/${idGuest + 5}`)
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(404)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'ErrorNotFound')
        expect(body).toHaveProperty('message', 'not found')
        done()
      })
  })
})
const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { hashPwd, generateToken, verifyToken } = require('../helpers')
const dummy = 'https://www.faitron.com/wp-content/uploads/2018/08/dummy.jpg'

const passTest = 'password'
const userTest = {
  name: 'Aqil',
  email: 'aqil@mail.com',
  password: hashPwd(passTest),
  phoneNumber: '72777777',
  createdAt: new Date(),
  updatedAt: new Date()
}
let otherUserTest = {
  name: 'Manda',
  email: 'manda@mail.com',
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
let other_access_token
let wrong_access_token
let idWeds
let wrong_idWeds
let idInvt

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
      const { id, groomName, brideName } = weddings[0]
      idWeds = id
      invitationTest.WeddingId = id
      invitationTest.brigeNickname = brideName
      invitationTest.groomNickname = groomName
      return queryInterface.bulkInsert('Invitations', [ invitationTest ], { returning: true })
    })
    .then(inv => {
      idInvt = inv[0].id
      return queryInterface.bulkInsert('Users', [otherUserTest], { returning: true })
    })
    .then(othUser => {
      const { id, email } = othUser[0]
      addOtherWeddingTest.UserId = id
      other_access_token = generateToken({ id, email })
      return queryInterface.bulkInsert('Weddings', [addOtherWeddingTest], { returning: true })
    })
    .then(othWeds => {
      wrong_idWeds = othWeds[0].id
      done()
    })
    .catch(err => done(err))
})

afterAll(done => {
  queryInterface.bulkDelete('Users')
    .then(() => { return queryInterface.bulkDelete('Weddings') })
    .then(() => { return queryInterface.bulkDelete('Invitations') })
    .then(() => done())
    .catch(err => done(err))
})

describe('GET /invitations', () => {
  test('Case 1: Success get invitation info', done => {
    request(app)
      .get('/invitations')
      .set('access_token', access_token)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('brigeNickname', 'Shizuka')
        done()
      })
  })

  test(`Case 2: Wrong access token`, done => {
    request(app)
      .get('/invitations')
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
      .get('/invitations')
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

  test(`Case 4: Don't have invitation form`, done => {
    request(app)
      .get('/invitations')
      .set('access_token', other_access_token)
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

describe('GET /events/:id', () => {
  test('Case 1: Success get event page', done => {
    request(app)
      .get(`/events/${idInvt}`)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('groomNickname', 'Nobita')
        done()
      })
  })
})

describe('PUT /invitations/:id', () => {
  test('Case 1: Success update invitation info', done => {
    request(app)
      .put(`/invitations/${idInvt}`)
      .set('access_token', access_token)
      .send({
        brigeNickname: 'Shizuka',
        groomNickname: 'Nobita',
        story: 'Your story here',
        title: 'Title',
        backgroundImg: dummy,
        additionalImg: dummy,
        videoUrl: 'Ini video',
        backgroundColor: '#1687a7',
        textColor: '#d3e0ea',
        timeEvent1: '8.00',
        timeEvent2: '11.00',
        youtubeUrl: 'https://youtube.com'
      })
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toHaveProperty('backgroundImg')
        done()
      })
  })

  test('Case 2: Wrong access token', done => {
    request(app)
      .put(`/invitations/${idInvt}`)
      .set('access_token', wrong_access_token)
      .send({
        brigeNickname: 'Shizuka',
        groomNickname: 'Nobita',
        story: 'Your story here',
        title: 'Title',
        backgroundImg: dummy,
        additionalImg: dummy,
        videoUrl: 'Ini video',
        backgroundColor: '#1687a7',
        textColor: '#d3e0ea',
        timeEvent1: '8.00',
        timeEvent2: '11.00',
        youtubeUrl: 'https://youtube.com'
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
      .put(`/invitations/${idInvt}`)
      .send({
        brigeNickname: 'Shizuka',
        groomNickname: 'Nobita',
        story: 'Your story here',
        title: 'Title',
        backgroundImg: dummy,
        additionalImg: dummy,
        videoUrl: 'Ini video',
        backgroundColor: '#1687a7',
        textColor: '#d3e0ea',
        timeEvent1: '8.00',
        timeEvent2: '11.00',
        youtubeUrl: 'https://youtube.com'
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

  test('Case 4: Wrong invitation ID (Different User ID)', done => {
    request(app)
      .put(`/invitations/${idInvt}`)
      .set('access_token', other_access_token)
      .send({
        brigeNickname: 'Shizuka',
        groomNickname: 'Nobita',
        story: 'Your story here',
        title: 'Title',
        backgroundImg: dummy,
        additionalImg: dummy,
        videoUrl: 'Ini video',
        backgroundColor: '#1687a7',
        textColor: '#d3e0ea',
        timeEvent1: '8.00',
        timeEvent2: '11.00',
        youtubeUrl: 'https://youtube.com'
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

  test('Case 5: Invitation ID not found', done => {
    request(app)
      .put(`/invitations/${idInvt + 5}`)
      .set('access_token', access_token)
      .send({
        brigeNickname: 'Shizuka',
        groomNickname: 'Nobita',
        story: 'Your story here',
        title: 'Title',
        backgroundImg: dummy,
        additionalImg: dummy,
        videoUrl: 'Ini video',
        backgroundColor: '#1687a7',
        textColor: '#d3e0ea',
        timeEvent1: '8.00',
        timeEvent2: '11.00',
        youtubeUrl: 'https://youtube.com'
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
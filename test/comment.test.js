const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { hashPwd } = require('../helpers')
const dummy = 'https://www.faitron.com/wp-content/uploads/2018/08/dummy.jpg'

const passTest = 'password'
const userTest = {
  name: 'Galih',
  email: 'galih@mail.com',
  password: hashPwd(passTest),
  phoneNumber: '72777777',
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
let commentTest = {
  name: 'Budi',
  relationship: 'Sahabat Karib',
  message: 'Selamat ya, semoga samawa',
  InvitationId: 0
}
let otherCommentTest = {
  name: 'Galang',
  relationship: 'Sahabat Karib',
  message: 'Selamat ya, semoga samawa',
  InvitationId: 0
}
let idInvt

beforeAll((done) => {
  jest.setTimeout(30000)
  queryInterface.bulkInsert('Users', [userTest], { returning: true })
    .then(user => {
      const { id } = user[0]
      addWeddingTest.UserId = id
      return queryInterface.bulkInsert('Weddings', [addWeddingTest], { returning: true })
    })
    .then(weddings => {
      const { id, groomName, brideName } = weddings[0]
      idWeds = id
      invitationTest.WeddingId = id
      invitationTest.brigeNickname = brideName
      invitationTest.groomNickname = groomName
      return queryInterface.bulkInsert('Invitations', [invitationTest], { returning: true })
    })
    .then(inv => {
      const { id } = inv[0]
      commentTest.InvitationId = id
      idInvt = id
      done()
    })
    .catch(err => done(err))
})

afterAll((done) => {
  queryInterface.bulkDelete('Users')
    .then(() => { return queryInterface.bulkDelete('Weddings') })
    .then(() => { return queryInterface.bulkDelete('Invitations') })
    .then(() => done())
    .catch(err => done(err))
})

describe('POST /comments', () => {
  test('Case 1: Success post a comment', (done) => {
    request(app)
      .post('/comments')
      .send(commentTest)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(201)
        expect(body).toHaveProperty('name', 'Budi')
        done()
      })
  })

  test(`Case 2: Don't have Invitation ID`, (done) => {
    request(app)
      .post('/comments')
      .send(otherCommentTest)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(400)
        expect(body).toHaveProperty('status', 'Error')
        expect(body).toHaveProperty('name', 'SequelizeForeignKeyConstraintError')
        expect(body).toHaveProperty('message', 'Invalid constraint error')
        done()
      })
  })
})

describe('GET /comments/:id', () => {
  test('Case 1: Success get all comment', (done) => {
    request(app)
      .get(`/comments/${idInvt}`)
      .end((err, res) => {
        if (err) return done(err)
        const { body, status } = res
        expect(status).toBe(200)
        expect(body).toEqual(expect.arrayContaining([]))
        done()
      })
  })
})
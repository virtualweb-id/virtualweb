const request = require('supertest')
const app = require('../app')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const { hashPwd } = require('../helpers/bcrypt')
const { generateToken } = require('../helpers/jwt')







describe('GET /wedding', () => {
  test('Case 1: Get wedding info', done => {
    request(app)

  })
})
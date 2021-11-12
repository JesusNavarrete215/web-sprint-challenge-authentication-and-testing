const request = require('supertest')
const server = require('./jokes/jokes-router')
const users = require('./auth/auth-router')
const db = require('../data/dbConfig')
// Write your tests here 2 test per API endpoints
test('sanity', () => {
  expect(true).toBe(true)
})

describe('[POST] /register', () => {
  test('responds with new hobbit',  () => {
    const res =  request(users)
      .post('/register').send({ name: 'rob', password: 12345 })
    expect(res.body).toMatchObject({ id: 5, name: "rob", password:12345 })
  })
})

describe('[POST] /login', () => {
  test('responds with new token', async () => {
    const res = await request(users)
      .post('/login').send({ name: 'jesus', password: 12345 })
    expect(res.body).toMatchObject({ name: "rob" })
  })
})


process.env.NODE_ENV = "test"

const request = require('supertest')
const app = require('../app')

describe('GET /address/all', ()=>{
    test('get all user addresses', async()=>{
        const res = await request(app).get('/address/all')
        expect(res.statusCode).toBe(200)
    })
})

describe('GET /address/:id')
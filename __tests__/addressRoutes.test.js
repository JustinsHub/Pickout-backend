process.env.NODE_ENV = "test"

const request = require('supertest')
const app = require('../app')
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config')

let testUsers;
let testUsersAddress
let testUserToken;


beforeEach(async ()=>{
    const hashedPw = await bcrypt.hash('12345', BCRYPT_WORK_FACTOR)
    const users = await db.query(`INSERT INTO users (username, password, first_name, last_name, email) 
                                VALUES ('Billy Frong', $1, 'Billy', 'Bong', '1111@gmail.com') 
                                RETURNING id, username`, [hashedPw])
    testUsers = users.rows[0]

    const userAddress = await db.query(`INSERT INTO user_address (user_id)
                                        VALUES ($1) RETURNING user_id`,
                                        [testUsers.id])
    testUsersAddress = userAddress.rows[0]
    testUserToken = jwt.sign(testUsers.id, SECRET_KEY)  
})

describe('GET /address/all', ()=>{
    test('get all user addresses', async()=>{
        const res = await request(app).get('/address/all')
        expect(res.statusCode).toBe(200)
    })
})

describe('GET /address/:id', ()=>{
    test('Get address based on user id', async()=>{
        const res = await request(app).get(`/address/${testUsersAddress.user_id}`)
        expect(res.statusCode).toBe(200)
    })
    test('User id for address not found', async()=>{
        const res = await request(app).get(`/address/131238`)
        expect(res.statusCode).toBe(404)
    })
})

describe('PATCH /address/update/:id', ()=>{
    test('Updating our address', async() =>{
        const res = await request(app)
            .patch(`/address/update/${testUsersAddress.user_id}`)
                .send({street_address: '1111 Avenue', 
                        address_number: 2,
                        city: 'Los Angeles',
                        state: 'CA',
                        zip_code: 90029,
                        country: 'United States'})
        expect(res.statusCode).toBe(201)
    })
})

afterEach(async ()=>{
    await db.query('DELETE FROM users')
    await db.query('DELETE FROM user_address')
})

afterAll(async ()=>{
    await db.end()
})
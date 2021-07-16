process.env.NODE_ENV = "test"

const request = require('supertest')
const app = require('../app')
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config')

let testUsers;
let testUserToken;
let signatureMeal;
let pairMeal;

beforeEach(async ()=>{
    //inset a test user
    const hashedPw = await bcrypt.hash('12345', BCRYPT_WORK_FACTOR)
    const users = await db.query(`INSERT INTO users (username, password, first_name, last_name, email) 
                                VALUES ('Billy Frong', $1, 'Billy', 'Bong', '1111@gmail.com') 
                                RETURNING id, username`, [hashedPw])
    testUsers = users.rows[0]

    const ourSignatureMeal = await db.query(`INSERT INTO signature_meal (price) VALUES (8.99) RETURNING id`)
    const ourPairMeal = await db.query(`INSERT INTO pair_meal (price) VALUES (7.99) RETURNING id`)
    signatureMeal = ourSignatureMeal.rows[0]
    pairMeal = ourPairMeal.rows[0]

    testUserToken = jwt.sign(testUsers.id, SECRET_KEY)  
})

describe('GET /signature-meal', ()=> {
    test('Request signature meal', async()=>{
        const res = await request(app).get('/meals/signature-meal')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            id: signatureMeal.id,
            price: "8.99"
        })
    })
})

describe('GET /pair-meal', ()=>{
    test('Request pair meal', async()=>{
        const res = await request(app).get('/meals/pair-meal')
        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            id: pairMeal.id,
            price: "7.99"
        })
    })
})

describe('POST /signature/:mealId/purchase/:userId/', () => {
    test('Purchasing signature meal success', async()=>{
        const res = await request(app).post(`/meals/signature/${signatureMeal.id}/purchase/${testUsers.id}/`)
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({
            purchased: "Signature Meal"
        })
    })
})

describe('POST /pair-meal/:mealId/purchase/:userId/', () => {
    test('Purchasing signature meal success', async()=>{
        const res = await request(app).post(`/meals/pair-meal/${signatureMeal.id}/${pairMeal.id}/purchase/${testUsers.id}/`)
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({
            purchased: "Pair Meal"
        })
    })
})

afterEach(async ()=>{
    await db.query('DELETE FROM users')
    await db.query('DELETE FROM signature_meal')
    await db.query('DELETE FROM pair_meal')
})

afterAll(async ()=>{
    await db.end()
})
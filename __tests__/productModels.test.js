process.env.NODE_ENV = "test"

const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config')
const Product = require('../models/productModels')

let testUsers;
let testUserToken;
let signatureMeal;
let pairMeal;

beforeEach(async ()=>{
    //inset a test user
    const hashedPw = await bcrypt.hash('12345', BCRYPT_WORK_FACTOR)
    const users = await db.query(`INSERT INTO users (username, password, first_name, last_name, email) 
                                VALUES ('Billy Bong', $1, 'Billy', 'Bong', '1111@gmail.com') 
                                RETURNING id, username`, [hashedPw])
    testUsers = users.rows[0]

    const ourSignatureMeal = await db.query(`INSERT INTO signature_meal (price) VALUES (8.99) RETURNING id`)
    const ourPairMeal = await db.query(`INSERT INTO pair_meal (price) VALUES (7.99) RETURNING id`)
    signatureMeal = ourSignatureMeal.rows[0]
    pairMeal = ourPairMeal.rows[0]

    testUserToken = jwt.sign(testUsers.id, SECRET_KEY)  
})

//Searching using signature meal method
describe('Get signature meal', ()=>{
    test('Get info about signature meal', async()=>{
        const signatureMeal = await Product.getSignatureMeal()
        expect(signatureMeal).toEqual({
            id: signatureMeal.id,
            price: "8.99"
        })
    })
})

//Searching using pair meal method
describe('Get pair meal', ()=>{
    test('Get info about pair meal', async()=>{
        const pairMeal = await Product.getPairMeal()
        expect(signatureMeal).toEqual({
            id: pairMeal.id,
            price: "7.99"
        })
    })
})

//Inserting using signatureMealPurchase method
describe('Purchase signature meal', )

afterEach(async ()=>{
    await db.query('DELETE FROM users')
    await db.query('DELETE FROM signature_meal')
    await db.query('DELETE FROM pair_meal')
})

afterAll(async ()=>{
    await db.end()
})
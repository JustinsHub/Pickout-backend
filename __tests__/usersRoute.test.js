process.env.NODE_ENV = "test"

const request = require('supertest')
const app = require('../app')
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config')

let testUsers;
let testUserToken;

beforeEach(async ()=>{
    const hashedPw = await bcrypt.hash('12345', BCRYPT_WORK_FACTOR)
    const user = await db.query(`INSERT INTO users (username, password, first_name, last_name, email) 
                                VALUES ('Billy Bong', $1, 'Billy', 'Bong', '1111@gmail.com') 
                                RETURNING id, username`, [hashedPw])
    testUsers = user.rows[0]
    testUserToken = jwt.sign(testUsers.id, SECRET_KEY)  
})


// describe('GET /users',()=> {  
//     test('GET all users', async()=>{
//         const res = await request(app).get('/users/all')
//         expect(res.statusCode).toBe(200)
//     })
// })

describe('GET /users/:id', ()=>{
    test('GET users by their id', async()=>{
        const res = await request(app).get(`/users/${testUsers.id}`)
        expect(res.statusCode).toBe(200)
    })
})

describe('POST /register',()=>{
    test('Register a new user', async()=>{
        const res = await request(app)
            .post('/auth/register')
                .send({username:'Dexter', 
                        password: '12345', 
                        email: '1111@gmail.com'})
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({Registered: "Dexter", token: expect.any(String)})
    })
})

//fix this
describe('POST /login', ()=>{
    test('Login a user', async()=>{
        const res = await request(app)
            .post('/auth/login')
                .send({username:'Billy Bong', 
                        password:'12345'})
        expect(res.statusCode).toBe(201)
        expect(res.body).toEqual({LoggedIn: "Billy Bong", token: expect.any(String)})
    })
})

describe('PATCH /update/:id', ()=> {
    test('Editing a user', async()=>{
        const res = await request(app)
            .patch(`/users/update/${testUsers.id}`)
                .send({first_name: "Billy", last_name: "Bong", email: "1111@gmail.com"})
        expect(res.statusCode).toBe(201)
    })
})

describe('DELETE /delete/:id', ()=> {
    test('Deleting a user', async()=> {
        const res = await request(app)
            .delete(`/users/delete/${testUsers.id}`)
        expect(res.body).toEqual({User: "DELETED"})
    })
})

afterEach(async ()=>{
    await db.query('DELETE FROM users')
})

afterAll(async ()=>{
    await db.end()
})
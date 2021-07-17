process.env.NODE_ENV = "test"

const User = require('../models/usersModel')
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {BCRYPT_WORK_FACTOR, SECRET_KEY} = require('../config')
const ExpressError = require('../expressError')

let testUsers;
let testUserToken;

beforeEach(async ()=>{
    const hashedPw = await bcrypt.hash('12345', BCRYPT_WORK_FACTOR)
    const user = await db.query(`INSERT INTO users (username, password, first_name, last_name, email) 
                                VALUES ('Billy Bong', $1, 'Billy', 'Bong', '1111@gmail.com') 
                                RETURNING *`, [hashedPw]) //if we want to identify one of the rows MUST ADD IN RETURN
    testUsers = user.rows[0]
    testUserToken = jwt.sign(testUsers.id, SECRET_KEY)  
})
    //User.register model

describe('Mock register info', ()=>{
    test('Register a user', async()=>{
        const user = await User.register('Test', '12345,', '1111@gmail.com')
        expect(user).toEqual({
            created_on: undefined, 
            email: undefined, 
            first_name: undefined, 
            id: user.id, 
            username: "Test", 
            last_name: undefined, 
            password: undefined, 
            username: undefined
        })
    })
})

    //User.login model

describe('Authorized user login', ()=>{
    test('Login works', async()=>{
        const user = await User.login('Billy Bong', '12345')
        expect(user).toEqual({
            username: 'Billy Bong',
            id: testUsers.id
        })
    })

    test('Username invalid', async()=>{
        try {
            await User.login('Billy Brong', '12345')
            fail()
        } catch (error) {
            expect(error instanceof ExpressError).toBeTruthy();
        }
    })

    test('Password not matched', async()=>{
        try {
            await User.login('Billy Bong', 'Wrong')
            fail()
        } catch (error) {
            expect(error instanceof ExpressError).toBeTruthy();
        }
    })
})

//Get all users method
describe('Find all users in DB', ()=>{
    test('getAll method', async()=>{
        const allUsers = await User.getAll()
        expect(allUsers).toEqual(
            [
                {
                created_on: undefined, 
                email: "1111@gmail.com", 
                first_name: "Billy", 
                id: testUsers.id, 
                last_name: "Bong", 
                password: testUsers.password, 
                username: "Billy Bong"
                }
        ])
    })
})

//Get user ID method
describe('Get user by ID', ()=>{
    test('Get single user', async()=>{
        const user = await User.getUserId(testUsers.id)
        expect(user).toEqual({
            created_on: undefined,
            id: testUsers.id,
            username: testUsers.username,
            first_name: "Billy",
            last_name: "Bong",
            email: "1111@gmail.com",
            password: undefined
        })
    })
    test('User ID not found', async()=>{
        try {
            const user = await User.getUserId(2349)
            fail()
        } catch (error) {
            expect(error instanceof ExpressError).toBeTruthy();
        }
    })
})

//Updating with updateUser method
describe('Updating a user', ()=>{
    test('Update user details', async()=>{
        const user = await User.getUserId(testUsers.id)
        user.first_name = "illy"
        user.last_name = "ong"
        user.email = "1@gmail.com"
        user.updateUser()
        expect(user).toEqual({
            created_on: undefined,
            email: "1@gmail.com",
            first_name: "illy",
            id: testUsers.id,
            last_name: "ong",
            password: undefined,
            username: "Billy Bong",
        })
    })
})

//Delete user with deleteUser method
describe('Delete user', ()=>{
    test('Delete user method', async()=>{
        const user = await User.getUserId(testUsers.id)
        user.deleteUser()
        const res = await db.query(
            "SELECT * FROM users WHERE username='Billy Bong'");
        expect(res.rows.length).toEqual(0)
        //Returns which user is deleted
        expect(user).toEqual({
            created_on: undefined,
            email: "1111@gmail.com",
            first_name: "Billy",
            id: testUsers.id,
            last_name: "Bong",
            password: undefined,
            username: "Billy Bong",
        })
    })
})

afterEach(async ()=>{
    await db.query('DELETE FROM users')
})

afterAll(async ()=>{
    await db.end()
})
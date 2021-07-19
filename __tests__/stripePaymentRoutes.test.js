process.env.NODE_ENV = "test"

const request = require('supertest')
const app = require('../app')
const db = require('../db')

describe('Making Stripe payment', ()=> {
    test('Request signature meal payment', async()=>{
        const res = await request(app).post('/stripe/signature-meal-payment')
        expect(res.statusCode).toBe(200)
        //fails because there's no input on the body
        expect(res.body).toEqual({
            message: "Payment failed",
            success: false
        })
    })
    test('Request pair meal payment', async()=>{
        const res = await request(app).post('/stripe/pair-meal-payment')
        expect(res.statusCode).toBe(200)
        //fails due to no input of credit card
        expect(res.body).toEqual({
            message: "Payment failed",
            success: false
        })
    })
})
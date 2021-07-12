process.env.NODE_ENV = "test"

const request = require('supertest')
const app = require('../app')
const db = require('../db')

describe('testing missing paths', () => {
    test("not found for site 404", async function () {
        const resp = await request(app).get("/no-such-path");
        expect(resp.statusCode).toEqual(404);
    });
})

afterAll(async ()=>{
    await db.end()
})
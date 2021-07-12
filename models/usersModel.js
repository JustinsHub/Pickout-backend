const db = require('../db')
const ExpressError = require('../expressError')
const bcrypt = require('bcrypt')
const {BCRYPT_WORK_FACTOR} = require('../config')

class User {
    constructor(id, username, password, first_name, last_name, email, created_on){
        this.id = id;
        this.username = username;
        this.password = password;
        this.first_name = first_name;
        this.last_name = last_name; 
        this.email = email;
        this.created_on = created_on
    }

    //Gets all users
    static async getAll(){
        const results = await db.query(`SELECT id, username, password, first_name, last_name, email
                                        FROM users`)
        const users = results.rows.map(u => new User(u.id, u.username, u.password, u.first_name, u.last_name, u.email))
        return users
    }

    //get user by id by plugging in currentUser id
    static async getUserId(id){
        const results = await db.query(`SELECT id, username, first_name, last_name, email
                                        FROM users WHERE id=$1`, [id])
        const u =  results.rows[0]
        if(!u){
            throw new ExpressError("User not found", 404)
        }
        return new User(u.id, u.username, u.password, u.first_name, u.last_name, u.email)
    }

    //sign up a user by hashing their password with timestamp
    static async register(user, pass, mail){
        const timeCreated = new Date(Date.now())
        const hashedPassword = await bcrypt.hash(pass, BCRYPT_WORK_FACTOR) 
        const results = await db.query(`INSERT INTO users (username, password, email, created_on) VALUES ($1,$2,$3,$4)
                                        RETURNING id, username`, [user, hashedPassword, mail, timeCreated])
        const newUser = results.rows[0]
        if(newUser){
            delete newUser.password
        }
        return new User(newUser)
    }

    //login a user by checking hashed password
    static async login(username, password){
        const results = await db.query(`SELECT id, username, password FROM users WHERE username = $1`, [username])
        const user = results.rows[0]
        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            if (isValid === true) {
            delete user.password;
            return user;
            }
        }
        throw new ExpressError('Username/Password are required.', 400)
    }

    //check user password for extra authenication
    static async checkPassword(id, password){ //keep this for now
        const results = await db.query(`SELECT id, password FROM users WHERE id=$1`, [id])
        const userId = results.rows[0]
        const validPassword = await bcrypt.compare(password, userId.password)
        if(validPassword === true){
            return validPassword
        }
        throw new ExpressError(`Wrong Password!`, 400)

    }

    //update user when user edits profile 
    async updateUser(){
        const res = await db.query(`UPDATE users SET first_name=$1, last_name=$2, email=$3 WHERE id=$4 
                                    `,[this.first_name, this.last_name, this.email, this.id])
        if(!res) {
            throw new ExpressError('Must fill out all input', 400)
        }
    }

    //be gone user
    async deleteUser(){
        if(this.id === undefined){
            throw new ExpressError('Invalid User', 404)
        }
        await db.query(`DELETE FROM users WHERE id=$1`, [this.id])
    }
}
module.exports = User

const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../config')
const ExpressError = require('../expressError')

const authenticateJWT = (req, res, next)=>{
    try{
    const token = req.headers._token //input token outcome in body for it to be verified
    const payload = jwt.verify(token, SECRET_KEY)
    req.user = payload //stores payload in this object to reuse in other apis/request
    console.log('VALID TOKEN')
        return next()
    }catch(e){
        return next() //moves on if there is no token with no error
    }
}

const ensureLoggedIn = (req, res, next) => {
    if(req.user) {
        return next()
    }else {
        const e = new ExpressError('Unauthorized', 401)
        return next(e)
    }
}

module.exports = {authenticateJWT, ensureLoggedIn}
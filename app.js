const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const {authenticateJWT} = require('./middleware/auth')
const usersRoutes = require('./routes/usersRoutes')
const authRoutes = require('./routes/auth')
const productsRoutes = require('./routes/productRoutes')
const addressRoutes = require('./routes/addressRoutes')
const stripePaymentRoutes = require('./routes/stripePaymentRoutes')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use(authenticateJWT)

app.use('/users', usersRoutes)
app.use('/auth', authRoutes)
app.use('/address', addressRoutes)
app.use('/meals', productsRoutes)
app.use('/stripe', stripePaymentRoutes)

app.use((error, req, res, next)=> {
    let status = error.status || 500
    let message = error.message
    return res.status(status).json({
        error:{message, status}
    })
})


process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason)
    process.exit(1)
  });
module.exports = app
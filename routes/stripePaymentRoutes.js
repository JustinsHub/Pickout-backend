const express = require('express');
const router = new express.Router()
const {STRIPE_SECRET_KEY} = require('../config')
const stripe = require('stripe')(STRIPE_SECRET_KEY)

router.post('/signature-meal-payment', async(req, res, next) => {
    let {amount, id} = req.body
    try {
        const payment = await stripe.paymentIntents.create({
            amount, 
            currency: "USD",
            description: "Signature Meal",
            payment_method: id,
            confirm: true
        })
        return res.json({
            message: "Payment successful",
            success: true
        })
    } catch (error) {
        return res.json({
            message: "Payment failed",
            success: false
        })
    }
})

router.post('/pair-meal-payment', async(req, res, next) => {
    let {amount, id} = req.body
    try {
        const payment = await stripe.paymentIntents.create({
            amount, 
            currency: "USD",
            description: "Signature Meal",
            payment_method: id,
            confirm: true
        })
        return res.json({
            message: "Payment successful",
            success: true
        })
    } catch (error) {
        return res.json({
            message: "Payment failed",
            success: false
        })
    }
})

module.exports = router
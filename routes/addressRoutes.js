const express = require('express')
const { user } = require('../db')
const router = new express.Router()
const Address = require('../models/addressModel')

//get all users address (ensureCreator only middleware later on)
router.get('/all', async(req, res, next) => {
    try{
    const results = await Address.getAllAddress()
    return res.json(results)
    }catch(e){
        return next(e)
    }
})

//get user address based on users id
router.get('/:id', async(req, res, next)=> {
    try{
        const {id} = req.params
        const results = await Address.getAddressId(id)
        return res.json(results)
    }catch(e){
        return next(e)
    }
})

//get user_id and apply to on params path and updates that specific users address. (add schema later for cleaner code)
router.patch('/update/:id', async(req, res, next)=> {
    try{
        const {id} = req.params
        const  {street_address, address_number, city, state, zip_code, country} = req.body
        const userAddress = await Address.getAddressId(id)
        userAddress.street_address = street_address
        userAddress.address_number = address_number
        userAddress.city = city
        userAddress.state = state
        userAddress.zip_code = zip_code
        userAddress.country = country
        await userAddress.updateAddress()
        return res.status(201).json(userAddress)
    }catch(e){
        return next(e)
    }
})

module.exports = router
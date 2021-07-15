const express = require('express')
const router = new express.Router()
const User = require('../models/usersModel')
const {ensureLoggedIn} = require('../middleware/auth')

router.get('/all', ensureLoggedIn, async (req, res, next)=> {
    try{
    const results = await User.getAll()
    return res.json(results)
    }catch(e){
        return next(e)
    }
})

router.get('/:id', async (req, res, next)=> {
    try{
    const {id} = req.params
    const user = await User.getUserId(id)
    return res.json(user)
    }catch(e){
        return next(e)
    }
})

router.patch('/update/:id', async(req,res,next)=>{
    const {id} = req.params
    const {first_name, last_name, email} = req.body
    try{
    const user = await User.getUserId(id)
    user.first_name = first_name
    user.last_name = last_name
    user.email = email
    await user.updateUser()
    return res.status(201).json(user)
    }catch(e){
        return next(e)
    }
})

router.delete('/delete/:id', async (req,res,next)=> {
    try{
    const {id} = req.params
    const user = await User.getUserId(id)
    await user.deleteUser()
    return res.json({User:"DELETED"})
    }catch(e){
        return next(e)
    }
})
module.exports = router
const express = require('express')
const User = require('../models/user')
const auth = require('../middlewares/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        const isDuplicate = await User.isDuplicateUser(user.email);
        if(!isDuplicate){
            await user.save()
            const token = await user.generateAuthToken()
            res.status(201).send({user, token})
        }        
    } catch (e) {
        res.status(400).send({msg:e.message})
    }
})

router.post('/users/login', async (req, res) => {

    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        return res.send({user, token})
    } catch (e) {
        res.status(400).send({msg:e.message})  
    }
})

router.post('/users/logout', auth, async(req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!== req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({msg:e.message})
    }
})

router.post('/users/logoutAll', auth, async(req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send({msg:e.message})
    }
})


router.get('/users/me',auth, async (req, res) => {
    res.send(req.user)
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        if(users){
            return res.send(users)
        }
        console.log(users);
        return res.status(404).send({msg:e.message})
    }catch(e){
        console.log(e);
        return res.status(500).send({msg:e.message})
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({msg:"Validation Error"})
    }

    try {
        updates.forEach(update=>req.user[update]=req.body[update])
        await req.user.save()
        return res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(400).send({msg:e.message})
    }
})

router.delete('/users/me',auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(500).send({msg:e.message})
    }
})
router.get('/users/search/:email', auth, async(req,res)=>{
    try {
        const user = await User.findByEmail(req.params.email)
        if(!user){
            return res.status(404).send({msg:"User Not Found"})
        }
        const userObj = user.toObject()
        delete userObj.password
        delete userObj.tokens
        return  res.status(202).send(userObj)
    } catch (e) {
        return res.status(500).send({msg:e.message})
    }
})
module.exports = router
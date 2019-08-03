const express = require('express')
const Item = require('../models/item')
const router = new express.Router()
const auth = require('../middlewares/auth')

router.get('/items', async (req, res) => {
    try {
        const items = await Item.find({})
        if(!items){
            res.status(404).send()
        }
        res.send(items)
    } catch (e) {
        res.status(500).send()
    }
})
router.get('/items/:id', async (req, res) => {
    try {
        const item = await Item.findById(req.params.id)
        if(!item){
            res.status(404).send()
        }
        res.send(item)
    } catch (e) {
        res.status(500).send()
    }
})
router.post('/items', async (req, res) => {
    const item = new Item(req.body)
    try {
        await item.save()
        return res.status(201).send(item)
    } catch (e) {
        return res.status(500).send()
    }
})
router.patch('/items/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'price', 'description']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const item = await Item.findById(req.params.id)
        if(!item){
            return res.status(404).send()
        }
        updates.forEach(update=>item[update]=req.body[update])
        await item.save()
        return res.send(item)
    }
    catch (e) {
        console.log(e)
        return res.status(500).send()
    }
})
router.delete('/items/:id', async(req,res)=>{
    try {
        const item= await Item.findByIdAndDelete(req.params.id)
        if(!item){
            return res.status(404).send()
        }
        await item.save()
        return res.send(item)
    }catch (e) {
        return res.status(500).send()
    }
})
module.exports = router

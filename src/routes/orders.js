const express = require('express')
const Order = require('../models/order')
const router = new express.Router()

router.post('/orders', async (req, res) => {
    const order = new Order(req.body)

    try {
        await order.save()
        res.status(201).send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/orders', async (req, res) => {
    try {
        const order = await Order.find({})
        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/orders/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const order = await Order.findById(_id)

        if (!order) {
            return res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})

router.patch('/orders/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'body', 'author']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        if (!order) {
            return res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(400).send(e)
    }
})
router.delete('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id)

        if (!order) {
            res.status(404).send()
        }

        res.send(order)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router
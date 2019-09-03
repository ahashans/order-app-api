const express = require('express')
const Message = require('../models/message')
const MessageThread = require('../models/message-thread')
const router = new express.Router()
const auth = require('../middlewares/auth')

router.post('/messages/:threadId',auth, async (req, res) => {    
    
});

router.post('/messages/new/:recipient', async (req, res) => {
    try {
        const messageThread = new MessageThread({
            participants:[
                req.body.recipient,
                req.user._id,
            ]
        })
        await messageThread.save()
        const message = new Message({
            ...req.body,
            threadId:messageThread._id,
            sender:req.user._id
        })
        await message.save()

        return res.status(201).send(message)
    } catch (e) {
        return res.status(500).send()
    }
});

module.exports = router

const express = require('express')
const Message = require('../models/message')
const MessageThread = require('../models/message-thread')
const router = new express.Router()
const auth = require('../middlewares/auth')

router.post('/messages/:threadId',auth, async (req, res) => {    
    try {
        const messageThread = new MessageThread({
            participants:[
                req.body.recipient,
                req.user._id,
            ]
        })
        await messageThread.save()
        return res.status(201).send(item)
    } catch (e) {
        return res.status(500).send()
    }
});

router.post('/messages/new/:recipient', async (req, res) => {
    
});

module.exports = router

const express = require('express')
const Message = require('../models/message')
const MessageThread = require('../models/message-thread')
const router = new express.Router()
const auth = require('../middlewares/auth')

router.post('/messages/:threadId',auth, async (req, res) => {    
    
});

router.post('/messages/new/:recipient', auth, async (req, res) => {

    try {
        if(!req.params.recipient){
            throw Error("Recipient not found!")
        }
        const messageThread = new MessageThread({
            participants:[
                req.params.recipient,
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
        console.log(e)
        return res.status(500).send()
    }
});
router.post("/messages/reply/:threadId",auth, async (req,res)=>{
    try{
        if(!req.params.threadId){
            throw Error("Thread Not Found");
        }
        const reply = new Message({
            ...req.body,
            sender:req.user._id,
            threadId: req.params.threadId,
        });
        await reply.save();
        return res.send(reply);
    }catch (e) {
        console.log(e)
        return res.status(500).send();
    }

});
module.exports = router;

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
router.get("/messages/inbox", auth, async (req, res)=>{
    try {
        const messageThreads = await MessageThread.find({participants:req.user._id}, "_id" );
        if(messageThreads){
            let inbox =[];
            for(const messageThread of messageThreads){
                const message = await Message.find({threadId:messageThread._id})
                                        .sort({createdAt:-1})
                                        .limit(1)
                                        .populate({path:'sender', select: "email name"});
                inbox.push(message);
            }
            if(!inbox){
                return res.status(404).send("No Message Found")
            }                        
            return res.send(inbox);
        }
    } catch (error) {
        return res.status(500).send();
    }
});
router.get("/messages/:threadId", auth, async(req,res)=>{
    try {
        const messages  = await Message.find({threadId:req.params.threadId}).select("createdAt body sender")
                                                                            .sort({createdAt:-1})
                                                                            .populate({path:'sender', select:'name email'});
        if(!messages){
            return res.status(404).send("No message found");
        }                                                                            
        return res.send(messages);
    } catch (error) {
        return res.status(500).send()
    }
});
module.exports = router;

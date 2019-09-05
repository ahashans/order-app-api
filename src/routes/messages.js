const express = require('express');
const Message = require('../models/message');
const MessageThread = require('../models/message-thread');
const router = new express.Router();
const auth = require('../middlewares/auth');

router.post('/messages/:threadId',auth, async (req, res) => {    
    
});

router.post('/messages', auth, async (req, res) => {
    try {
        if(!req.body.threadId){
            if(!req.body.recipient){
                throw Error("Recipient not found!");
            }
            const messageThread = new MessageThread({
                participants:[
                    req.body.recipient,
                    req.user._id,
                ]
            });
            await messageThread.save();
            const message = new Message({
                ...req.body,
                threadId:messageThread._id,
                sender:req.user._id
            });
            await message.save()
            return res.status(201).send(message);
        }else{
            if(!req.body.threadId){
                throw Error("Thread Not Found");
            }
            const reply = new Message({
                ...req.body,
                sender:req.user._id,
                threadId: req.body.threadId,
            });
            await reply.save();
            return res.send(reply);
        }

    } catch (e) {
        console.log(e);
        return res.status(500).send()
    }
});

router.get("/messages", auth, async (req, res)=>{
    try {
        const messageThreads = await MessageThread.find({participants:req.user._id}, "_id" );
        if(messageThreads){
            let inbox =[];
            for(const messageThread of messageThreads){
                const message = await Message.find({threadId:messageThread._id})
                                        .sort({createdAt:-1})
                                        .limit(1)
                                        .populate({path:'sender', select: "email name"})
                                        .populate({path:'threadId', populate:{path:'participants', model:'Users'}});
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
        const messages  = await Message.find({threadId:req.params.threadId}).sort({createdAt:-1})
                                                                            .populate({path:'sender', select:'name email'})
                                                                            .populate({path:'threadId', populate:{path:'participants', model:'Users'}});
        if(!messages){
            return res.status(404).send("No message found");
        }                                                                            
        return res.send(messages);
    } catch (error) {
        return res.status(500).send()
    }
});
module.exports = router;

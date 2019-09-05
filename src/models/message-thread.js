const  mongoose = require('mongoose')
const messageThreadSchema = mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Users'
    }]                
})
messageThreadSchema.virtual('messages',{
    ref:'Messages',
    localField:'_id',
    foreignField:'threadId'
})
const MessageThread  = mongoose.model("MessageThreads",messageThreadSchema)
module.exports = MessageThread
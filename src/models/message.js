const  mongoose = require('mongoose');
const messageSchema = mongoose.Schema({
    threadId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'MessageThreads'        
    },
    body:[
        {
            text:{
                type:mongoose.Schema.Types.String
            },
            emoji:{
                type:mongoose.Schema.Types.String
            },
            filePath:{
                type:mongoose.Schema.Types.String
            }
        }
    ],
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Users'
    },
    
},{
    timestamps:true
});

const Message  = mongoose.model("Messages",messageSchema);
module.exports = Message;
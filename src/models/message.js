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
                type:mongoose.Schema.Types.String,
                default:""
            },
            emoji:{
                type:mongoose.Schema.Types.String,
                default:""
            },
            filePath:{
                type:mongoose.Schema.Types.String,
                default:""
            }
        }
    ],
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Users'
    },
    seenAt:{
        type:mongoose.Schema.Types.Date
    }
},{
    timestamps:true
});

const Message  = mongoose.model("Messages",messageSchema);
module.exports = Message;
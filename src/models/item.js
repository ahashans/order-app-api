const  mongoose = require('mongoose')
const itemSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:false,
        trim:true
    }
})
const Item  = mongoose.model("Items",itemSchema)
module.exports = Item
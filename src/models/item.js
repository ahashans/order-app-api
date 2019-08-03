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
itemSchema.virtual('orders',{
    ref:'Orders',
    localField:'_id',
    foreignField:'details.item'
})
const Item  = mongoose.model("Items",itemSchema)
module.exports = Item
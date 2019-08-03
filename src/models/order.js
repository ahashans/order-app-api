const  mongoose = require('mongoose')
const validator = require('validator')
const orderSchema = mongoose.Schema({
    item:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Items'
    },
    quantity:{
        type:Number,
        required:true,
        trim:true    
    },
    date: {
        type: Date,
          // `Date.now()` returns the current unix timestamp as a number
        default: Date.now
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Users'
    }
})
const Order  = mongoose.model("Orders",orderSchema)
module.exports = Order
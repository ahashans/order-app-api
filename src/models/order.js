const  mongoose = require('mongoose')
const validator = require('validator')
const orderSchema = mongoose.Schema({    
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,                
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    item:{
        type:String,
        required:true,
        trim:true    
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
    }       
})
const Order  = mongoose.model("Orders",orderSchema)
module.exports = Order
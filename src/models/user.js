const  mongoose = require('mongoose')
const validator = require('validator')
const User  = mongoose.Model("Users",{
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase: true,
        unique:true,
        dropDups: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required,
        trim:true    
    }

})
const  mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name:{
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
        required:true,
        trim:true    
    },
    avatar:{
        type:mongoose.Schema.Types.String,
        trim:true
    },
    tokens:[{
        token:{
            type:String,
            required:true,

        }
    }]

})

userSchema.virtual('orders',{
    ref: 'Orders',
    localField: '_id',
    foreignField:'owner'
})
userSchema.virtual('groups',{
    ref:'Groups',
    localField:'_id',
    foreignField:'participants'
})
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString(), name:user.name},
        'OrderAppBackend',{ expiresIn: 60 * 60 * 24 * 7})
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    
    return userObject
}

userSchema.statics.findByCredentials = async(email,password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Invalid Email')
    }
    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        throw new Error('Invalid Password')
    }

    return user
}
userSchema.statics.findByEmail = async (email)=>{
    const user = await User.findOne({email})
    return user;
}
userSchema.statics.isDuplicateUser = async(email) =>{
    const user = await User.findOne({email})
    if(user){
        throw new Error('Duplicate Email')
    }
    return false    
}

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User  = mongoose.model("Users", userSchema)
module.exports = User
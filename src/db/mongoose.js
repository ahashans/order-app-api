const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/app-order-api",{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
}).then(()=>{
    ()=>{
        console.log("connection established!")
    },
    (err)=>{
        console.log("Unable to connect to database")
        console.log(err)
    }
})
const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://root:root@cluster0-9fexc.mongodb.net/order-app?retryWrites=true&w=majority",{
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
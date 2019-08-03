const express = require('express')
require('./db/mongoose')
const app = express()
const port = process.env.PORT || 3000
const orderRouter = require('./routes/orders')
const userRouter = require('./routes/user')
const itemRouter = require('./routes/items');

app.use(express.json())

app.get('/',(req,res)=>{
    res.send("Order Up!")
})
app.use(orderRouter)
app.use(userRouter)
app.use(itemRouter)
app.listen(port,()=>{
    console.log("Express is running in port: "+port)
})
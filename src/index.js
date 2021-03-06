const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const app = express()
const port = process.env.PORT || 3000
const orderRouter = require('./routes/orders')
const userRouter = require('./routes/user')
const itemRouter = require('./routes/items');
const messageRouter = require('./routes/messages')
const groupRouter = require('./routes/groups')
app.use(express.json())
app.use(cors())
app.get('/',(req,res)=>{
    res.send("Order Up!")
})
app.use(orderRouter)
app.use(userRouter)
app.use(itemRouter)
app.use(messageRouter)
app.use(groupRouter)

app.listen(port,()=>{
    console.log("Express is running in port: "+port)
})
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const router =require('./router/route')
const app =express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

// CONNECT DB
const url = "mongodb+srv://avijithazra1234:Techno16@cluster0.b7ob9.mongodb.net/practice1234-DB";
mongoose.connect(url,{ useNewUrlParser: true, }).then(()=>console.log('connect mongoDB')).catch((err)=>console.log(err))

app.use('/',router)

app.listen(3000,()=>{
    console.log(`server Start on ${3000}`)
})
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const router =require('./Route/route')
const app =express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


let url="mongodb+srv://avijithazra12:Avijit16@cluster0.b7ob9.mongodb.net/practice1234-DB?retryWrites=true&w=majority"
//let url="mongodb+srv://shubhra92:XUY8jRBU9QKzs2tS@clusterfrorblogandautho.wf2zo.mongodb.net/practic-Db?retryWrites=true&w=majority"
mongoose.connect(url, {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use('/',router)

app.listen(3000,()=>{
    console.log(`server Start on ${3000}`)
})
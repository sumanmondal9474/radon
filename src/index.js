const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
const router =require('./Route/route')
const app =express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


let url="mongodb+srv://suman:oHy9PfeRXPQ2lfhu@cluster0.xzzuzad.mongodb.net/project1"
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
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const moment = require('moment');
const ip=require('ip');
// const GobalApi= require("../testGlobalApi/globalApi")

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect("mongodb+srv://shubhro786:wdxgITU32OrB5mSa@cluster0.idazp.mongodb.net/shunhra-DB?retryWrites=true&w=majority", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )

app.use(
    function (req,res,next){
        // let ipAddr=req.ip
        let Atime=moment().format().split('T')
        let time=Atime[1].split('+')
        console.log(Atime[0]+" "+ time[0] +" , "+ip.address()+" , "+req.url)
        next() 
    }
)

app.use('/', route);


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});

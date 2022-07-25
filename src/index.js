const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const route = require('./routes/route')

const app = express()

app.use(bodyParser.json())
mongoose.connect("mongodb+srv://rajatrout470:tw1llhZ2PEKtw4qr@cluster0.rqmvg7o.mongodb.net/group55Database")
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))

app.use('/', route)


app.listen(process.env.PORT || 3000, function() {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});
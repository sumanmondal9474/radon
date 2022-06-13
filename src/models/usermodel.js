const mongoose = require('mongoose');

const  userSchema = new mongoose.Schema({
    name:String,
    blance:{
        type: Number,
        default: 100
    },
    address: String,
    age: Number,
    gender: {
        type:String,
        enmu:["male","female","other"]
    },
    isFreeAppUser:{

        type: Boolean,
        default: false
    }
},{timestamps: true});

module.exports = mongoose.model('Users', userSchema)
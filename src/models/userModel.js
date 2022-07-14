const mongoose= require('mongoose')

const userSchema= new mongoose.Schema({
    title:{ 
        type:String,
        required:'Please enter the title',
        enum:["Mr","Mrs","Miss"],
        trim:true
    },
    name:{
        type:String,
        required:'Please enter the name',
        trim:true
    },
    phone:{
        type:String, 
        required:'Please enter the phone number',
        unique: true,
        trim:true
    },
    email:{
        type:String,
        required:'Please enter the email Id ',
        unique: true,
        lowercase:true,
        trim:true
    },
    password:{
        type: String,
        required: 'Please enter the password',
        trim:true
    },
    address:{
        street: String,
        city:String,
        pincode:String      
    }
},{timestamps:true});

module.exports=new mongoose.model('User',userSchema)
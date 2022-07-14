const mongoose= require('mongoose')
const ObjectId=mongoose.Types.ObjectId
const moment =require('moment')

const bookSchema=new mongoose.Schema({
    title:{
        type:String,
        required:'Please enter book titile',
        unique:true,
        trim:true
    },
    excerpt:{
        type:String,
        required:'Please enter the excerpt',
        trim:true
    },
    userId:{
        type:ObjectId,
        ref:'User',
        required:true
    },
    ISBN:{
        type:String,
        required:'Please enter the ISBN',
        unique:true,
        trim:true
    },
    category:{
        type:String,
        required:'Please enter the category'
    },
    subcategory:{
        type:[String],
        required:'Please enter the category'
    },
    reviews:{
        type:Number,
        default:0
    },
    deletedAT:{
        type:Date,
        default:null
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    releasedAt:{
        type:Date,
        required:true,
        default: moment(new Date(), "YYYY/MM/DD")
    }

},{timestamps:true});

module.exports=new mongoose.model('Book',bookSchema)
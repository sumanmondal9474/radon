const mongoose=require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const internSchema = new mongoose.Schema( {
    isDeleted: {type: Boolean, default: false},
     name: {type:String,required:true,trim:true}, 
     email: {type:String, required:true, unique:true},
    mobile: {type:String, required:true, unique:true},
    collegeId: {type:ObjectId, 
        ref:"College"}
   

     
});

module.exports = mongoose.model('Intern', internSchema)
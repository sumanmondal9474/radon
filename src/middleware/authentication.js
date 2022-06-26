const jwt=require("jsonwebtoken")
const blogModel = require("../Model/blogModel")
//const {StringUtilities}=require('data-validator-js')



   


const authentication=(req,res,next)=>{
    try{
let token=req.headers["x-api-key"]
if(!token){
    res.status(400).send({status:false,msg:"Token absent"})
}

jwt.verify(token,"this-is-a-srcret-key")

next()
    }catch(err){
        res.status(500).send({status:false,msg:err.message})
   }
}

// ----------------------------authorisation-------------------------------

const authorisation=async(req,res,next)=>{
    try{
        const token=req.headers["x-api-key"]
        const blogId=req.params.blogId
        const blogByblogId=await blogModel.findById(blogId)
       // console.log(typeof blogByblogId.authorId)
        const userdata=jwt.verify(token,"this-is-a-srcret-key")
       // console.log(typeof userdata.authorId)
        if(blogByblogId.authorId!=userdata.authorId){
            res.status(403).send({status:false,msg:"authorisation failed"})
        
        }
        
        next()
    }catch(err){
        res.status(500).send({status:false,msg:err.message})
 }
}
module.exports={authentication,authorisation}
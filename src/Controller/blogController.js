const blogModel=require("../Model/blogModel")
const authorModel=require("../Model/authorModel")
const mongoose=require("mongoose")

const createBlog=async function(req,res){
    try{
    let data=req.body
    let{title,category,tags,subcategory,authorId,body}=data
    
    if(Object.keys(data).length==0){
        return res.status(400).send({status:false,msg:"please give keys properly" })
    }
    if(!title||!category||!authorId||!body){
        return res.status(400).send({status:false,msg:"please give required fields " })
    
}

if(title.trim()==false||!category.trim()||!authorId.trim()||!body.trim()){
    return res.status(400).send({status:false,msg:"please dont give spaces " })
}
if(!mongoose.isValidObjectId(authorId)){
    return res.status(400).send({status:false,msg:"please give authorId properly" })  
}


function a(x){
if(x) {if(x.trim())
    { 
    
        data[`${x}`]=x.trim()
      
    }else if(Object.keys(data).indexOf(x)){
       return res.send(400).send({status:false,msg:`no value of ${x}`})

    } 
}
}


if(tags) {if(tags.trim())
    { 
    
        data.tags=tags.trim()
      
    }else if(Object.keys(data).indexOf(tags)){
       return res.send(400).send({status:false,msg:"no value of tags"})

    } 
}

if(subcategory) {if(subcategory.trim())
    { 
    
        data.subcategory=subcategory.trim()
      
    }else if(Object.keys(data).indexOf(subcategory)){
       return res.send(400).send({status:false,msg:"no value of subcategory"})

    } 
}




    
    let blogCreate=await blogModel.create(data)
    return res.status(201).send({Status:false,data:blogCreate})

    }catch(err){
        res.status(500).send({err:err.message})
    }
}
module.exports.createBlog=createBlog
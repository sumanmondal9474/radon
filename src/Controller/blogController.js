const blogModel=require("../Model/blogModel")
const authorModel=require("../Model/authorModel")
const mongoose=require("mongoose")

const createBlog=async function(req,res){
    try{
    let data=req.body
    let{title,category,authorId,tags,subcategory,body}=data
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
let obj={title:title,
    category:category,
    authorId:authorId,
    body:body}


if(Object.keys(data).indexOf("tags")!==-1) {if(tags.trim())
    { 
        obj.tags=tags.trim()

    }else return res.status(400).send({status:false,msg:"no value of tags"})

}

if(Object.keys(data).indexOf("subcategory")!==-1) {if(subcategory.trim())
    { 
    
        obj.subcategory=subcategory.trim()
      
    }else return res.status(400).send({status:false,msg:"no value of subcategory"})
}
 let blogCreate=await blogModel.create(obj)
    return res.status(201).send({Status:false,data:blogCreate})

    }catch(err){
        res.status(500).send({err:err.message})
    }
}

// ------------------getBlogs--------------------------------------


const getBlogs=async function(req,res){
    try{
        const data=req.query
        
        let a=["subcategory","authorId","category","tags"] 
        let store =  onlythisValue.some(ele =>Object.keys(req.query).includes(ele) );
        
        
        const allBlog=await blogModel.find({$and:[data,{isDeleted:false,isPublished:true}]})

        if(!allBlog[0]){
            return res.status(404).send({status:false,msg:"No Blog found"}) 

        }

        
        return res.status(200).send({status:true,data:allBlog}) 

    }catch(err){
        return res.status(500).send({status:false,msg:"no value of tags"}) 
    }
}

module.exports.createBlog=createBlog
module.exports.getBlogs=getBlogs

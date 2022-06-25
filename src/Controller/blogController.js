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
        return res.status(500).send({status:false,msg:err.message}) 
    }
}
//---------------------------updateBlog--------------------------------------
const updateBlog=async function(req,res){
    try{
const data=req.params
let{title,subcategory,tags,body}=req.body


if(!data.blogId){
    return res.status(400).send({status:false,msg:"plz enter blogId"}) 

}
if(!mongoose.isValidObjectId(data.blogId)){
    return res.status(400).send({status:false,msg:"please give valid blogId properly" })
 }
if(!title|| title===undefined){
    return res.status(400).send({status:false,msg:"title val must be present" }) 
}

if(title.trim().length===0 )

return res.status(400).send({status:false,msg:"title val must be present" })

// 1st  process

// const updateBlog=await blogModel.findById(data.blogId)
// updateBlog.title=title
// updateBlog.subcategory.push(subcategory)
// updateBlog.tags.push(tags)
// updateBlog.body=body
// updateBlog.isPublished=true
// updateBlog.publishedAt=new Date()
// const a=await updateBlog.save()
// res.status(200).send({status:true,data:a})

// 2nd alternative process


// const updateBlog=await blogModel.findOneAndUpdate({_id:data.blogId},{$set:{title,subcategory,tags,body,isPublished:true,publishedAt:new Date()}},{new:true})
// res.status(200).send({status:true,data:updateBlog})

// 3rd alternative process


const updateBlog=await blogModel.findByIdAndUpdate(data.blogId,{$set:{title,subcategory,tags,body,isPublished:true,publishedAt:new Date()}},{new:true})
res.status(200).send({status:true,data:updateBlog})

    }catch(err){
        res.status(500).send({status:false,msg:err.message})
}
}

const deleteBlogbyPath=async function(req,res){
    try{
        const data=req.params

    
if(!mongoose.isValidObjectId(data.blogId)){
    return res.status(400).send({status:false,msg:"please give valid blogId " })
 }


 // 1st method

        // const deleteblog=await blogModel.updateOne({_id:data.blogId,isDeleted:false},{$set:{isDeleted:true,isPublished:false}})

        //console.log(deleteblog)

        // if(deleteblog.matchedCount!=1){
        //     res.status(404).send({status:false,msg:"not found"})
//}

//2nd method

const deleteblog=await blogModel.findOneAndUpdate({_id:data.blogId,isDeleted:false},{$set:{isDeleted:true,isPublished:false}},{new:true})

        res.status(200).send({status:true,data:deleteblog})
        

    }catch(err){
        res.status(500).send({status:false,msg:err.message})

    }
}


module.exports.createBlog=createBlog
module.exports.getBlogs=getBlogs
module.exports.updateBlog=updateBlog
module.exports.deleteBlogbyPath=deleteBlogbyPath
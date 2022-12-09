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
let blogData={title:title,
    category:category,
    authorId:authorId,
    body:body}
if(tags){
    if(Array.isArray(tags)){
         blogData["tags"]=[...tags]
    }
    if(Object.prototype.toString.call(tags)==="[object String]"){
         blogData["tags"]=[tags]
    }
    if(subcategory){
        if(Array.isArray(subcategory)){
             blogData["subcategory"]=[...subcategory]
        }
        if(Object.prototype.toString.call(subcategory)==="[object String]"){
             blogData["subcategory"]=[subcategory]
        }

    }
}


 let blogCreate=await blogModel.create(blogData)
    return res.status(201).send({status:true,data:blogCreate})

    }catch(err){
        res.status(500).send({err:err.message})
    }
}

// ------------------getBlogs--------------------------------------


const getBlogs=async function(req,res){
    try{
        const data=req.query
        let {subcategory,authorId,category,tags}=data
        let obj={}
    // console.log(typeof obj)
    // console.log(Object.keys(data)[0])
    //inside if undefind means false
       if(Object.keys(data)[0]){
            if(subcategory){
                //we are pushing obj within empty subcategory
                obj.subcategory=subcategory
            }
            if(tags){
                //we are pushing obj within empty tags
                obj.tags=tags
            }
            if(authorId){
                //we are pushing obj within empty authorId
                if(!mongoose.isValidObjectId(authorId)){
                    return res.status(400).send({status:false,msg:"please give valid authorId" })
                 }
                obj.authorId=authorId
            }
            if(category){
                //we are pushing obj within empty category
                obj.category=category
            }
            if(Object.keys(obj).length==0){
                return res.status(404).send({status:false,msg:"obj keys must be within [subcategory,authorId,category,tags]"}) 

            }
        }

        const allBlog=await blogModel.find({$and:[obj,{isDeleted:false}]})
      

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

// --------------------------------deleteblog----------------------------------------

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
//--------------------------deletebyQuery----------------------------

const deletebyQuery=async function(req,res){
    try{

        let data=req.query
  let {authorId,subcategory,tags,isPublished}=data
let obj={}

  if(Object.keys(data).length==0){
    return  res.status(400).send({status:true,msg:"plz enter atleast one query for filter a blog"})
 }
 if(authorId){
    if(!mongoose.isValidObjectId(data.authorId)){
        return res.status(400).send({status:false,msg:"please give valid authorId " })
     }
     obj.authorId=authorId
}
//console.log(obj)
if(tags){
    obj.tags=tags
    }
    if(subcategory){
        obj.subcategory=subcategory
        }
        if(isPublished!==undefined){
            obj.isPublished=isPublished
            }
if(Object.keys(obj).length==0){
    return  res.status(400).send({status:false,msg:"plz give query within [authorId,subcategory,tags,isPublished]"})
}

        const deletebyQuery=await blogModel.updateMany({$and:[obj,{isDeleted:false}]},{$set:{isDeleted:true,deletedAt:new Date,isPublished:false}})
         if(deletebyQuery.matchedCount==0) {
             return  res.status(404).send({status:true,msg:"there is no match"})}
        

        res.status(200).send({status:true,data:deletebyQuery})


    }catch(err){
        res.status(500).send({status:false,msg:err.message})

    }
}

module.exports={createBlog,getBlogs,updateBlog,deleteBlogbyPath,deletebyQuery}

const express = require("express");
const router = express.Router();
const author=require ("../Controller/authorController")
const blog=require("../Controller/blogController")
const blogModel=require("../Model/blogModel")
const {authentication,authorisation}=require("../middleware/authentication")

router.post("/authors",author.createAuthor)

router.post("/createblog",authentication,blog.createBlog)
router.get("/getBlog",authentication,blog.getBlogs)


router.put("/blogs/:blogId",authentication,authorisation,blog.updateBlog)
router.delete("/blogs/:blogId",authentication,authorisation,blog.deleteBlogbyPath)
router.delete("/blogs",blog.deletebyQuery)
router.post("/login",author.loginAuthor)

router.patch("/getBlog",async function(req,res){
    await blogModel.updateMany({},{isDeleted:false,deletedAt:null,isPublished:true})
    res.send("done")
})

module.exports=router
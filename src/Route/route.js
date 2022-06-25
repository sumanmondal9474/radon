const express = require("express");
const router = express.Router();
const author=require ("../Controller/authorController")
const blog=require("../Controller/blogController")
const blogModel=require("../Model/blogModel")
router.post("/authors",author.authorCreate)

router.post("/createblog",blog.createBlog)
router.get("/getBlog",blog.getBlogs)
router.patch("/getBlog",async function(req,res){
    await blogModel.updateMany({},{isPublished:true})
    res.send("done")
})

router.put("/blogs/:blogId",blog.updateBlog)

router.delete("/blogs/:blogId",blog.deleteBlogbyPath)
module.exports=router
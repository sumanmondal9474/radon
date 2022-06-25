const express = require("express");
const router = express.Router();
const author=require ("../Controller/authorController")
const blog=require("../Controller/blogController")
router.post("/authors",author.authorCreate)

router.post("/createblog",blog.createBlog)

module.exports=router
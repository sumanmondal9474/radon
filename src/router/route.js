const express =require('express');
const {authorCreate}=require('../Controller/authorController')
const{createBlog}=require("../Controller/blogController")


const router =express.Router();


router.post('/authors', (req,res)=>{
    res.send("working")
})
router.post('/Createauthors',authorCreate )
router.post('/createBlog',createBlog )


 

module.exports = router;
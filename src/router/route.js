const express =require('express');
const {authorCreate}=require('../Controller/authorController')



const router =express.Router();


router.post('/authors', (req,res)=>{
    res.send("working")
})
router.post('/Createauthors',authorCreate )


 

module.exports = router;
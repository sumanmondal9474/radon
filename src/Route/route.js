const express = require("express");
const router = express.Router();
const author=require ("../Controller/authorController")

router.post("/authors",function(req,res){
    res.send("done")
})


module.export=router
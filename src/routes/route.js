const express = require('express')
const router = express.Router();
const UserController=require('../controller/userController')

router.get("/test",function(req,res){
    res.send("My first api for checking the terminal")
})



router.post('/register',UserController.createUser)
router.post('/login',UserController.loginUser)


module.exports=router;

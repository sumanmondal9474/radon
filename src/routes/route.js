const express = require('express')
const router = express.Router();
const UserController=require('../controller/userController')
const BookController=require('../controller/bookController')

router.get("/test",function(req,res){
    res.send("My first api for checking the terminal")
})



router.post('/register',UserController.createUser)
router.post('/login',UserController.loginUser)
router.post('/books',BookController.createBook)
router.get('/books',BookController.getBooks)
router.get('/books/:bookId',BookController.getbookparam)
router.put('/books/:bookId',BookController.updateBooksById)

module.exports=router;

const express = require('express')
const router = express.Router();
const UserController=require('../controller/userController')
const BookController=require('../controller/bookController')
const ReviewModel=require('../controller/reviewController')

router.get("/test",function(req,res){
    res.send("My first api for checking the terminal")
})



router.post('/register',UserController.createUser)
router.post('/login',UserController.loginUser)
router.post('/books',BookController.createBook)
router.get('/books',BookController.getBooks)
router.get('/books/:bookId',BookController.getbookparam)
router.put('/books/:bookId',BookController.updateBooksById)
router.post('/books/:bookId/review',ReviewModel.createReview)
router.put('/books/:bookId/review/:reviewId',ReviewModel.updateReview)

router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})


module.exports=router;

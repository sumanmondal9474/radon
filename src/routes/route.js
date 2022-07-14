const express = require('express')
const router = express.Router();
const UserController=require('../controller/userController')
const BookController=require('../controller/bookController')
const ReviewModel=require('../controller/reviewController')
const Middleware=require('../middlewares/auth')
// test
router.get("/test",function(req,res){
    res.send("My first api for checking the terminal")
})

// user 
router.post('/register',UserController.createUser)
router.post('/login',UserController.loginUser)
// book
router.post('/books',Middleware.authenticate,BookController.createBook)
router.get('/books',Middleware.authenticate,BookController.getBooks)
router.get('/books/:bookId',Middleware.authenticate,BookController.getbookparam)
router.put('/books/:bookId',Middleware.authenticate,Middleware.authorise,BookController.updateBooksById)
router.delete('/books/:bookId',Middleware.authenticate,Middleware.authorise,BookController.deleteBooksById)
// review
router.post('/books/:bookId/review',ReviewModel.createReview)
router.put('/books/:bookId/review/:reviewId',ReviewModel.updateReview)
router.delete('/books/:bookId/review/:reviewId',ReviewModel.deleteReview)

router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        msg: "The api you request is not available"
    })
})



module.exports=router;

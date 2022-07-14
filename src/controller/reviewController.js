const BookModel = require('../models/bookModel')
const UserModel = require('../models/userModel')
const Validator = require('../validator/validator')
const ReviewModel = require('../models/reviewModel')

const mongoose = require('mongoose')


const createReview = async function (req, res) {
    try {
        // taking bookid from params
        let bookId = req.params.bookId
        if (!bookId) { return res.status(400).send({ status: false, message: "Please enter bookId" }) }
        
        // to validate the bookId is valid or not 
        if (!Validator.isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please enter valid bookId" }) }
        
        // to check the bookID in database
        let dbcall = await BookModel.findOne({ _id: bookId, isDeleted: false })
        
        // console.log(dbcall)
        if (!dbcall) return res.status(404).send({ status: false, message: "bookId not found" })

        // taking value from request body
        let requestBody = req.body
        
        // to check the request body is present
        if (!Validator.isvalidRequestBody(requestBody)) { return res.status(400).send({ status: false, msg: 'review is empty Please add some values' }) }
        
        // to destructure of requestbody 
        let { reviewedBy, rating, review } = requestBody

        if (!Validator.isValidBody(reviewedBy)) {
            reviewedBy = "Guest";
        }
        
        // to check rating is entered
        if (!rating) { return res.status(400).send({ status: false, message: "Rating is required", }) }
        if (typeof rating !== "number") {
            return res.status(400).send({
                status: false,
                message: "Rating must be number only",
            });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({
                status: false,
                message: "Rating must be 1 to 5",
            });
        }
        let obj = {
            reviewedBy,
            rating,
            review,
            bookId,
            reviewedAt: new Date(),
        };
        const reviewCreate = await ReviewModel.create(obj);

        if (reviewCreate) {
            await BookModel.findOneAndUpdate(
                { _id: bookId },
                { $inc: { reviews: 1 } }
            );
        }
        const sendReview = await ReviewModel.find({ _id: reviewCreate._id })
            .select({
                __v: 0,
                createdAt: 0,
                updatedAt: 0,
                isDeleted: 0,
            });
        res.status(201).send({ status: true, message: "Success", data: sendReview, });
    }
    catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }

}

const updateReview = async function (req, res) {

    try {
        
        // taking bookid from params
        let bookId = req.params.bookId
        if (!bookId) { return res.status(400).send({ status: false, message: "Please enter bookId" }) }
        
        // to validate the bookId is valid or not 
        if (!Validator.isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please enter valid bookId" }) }
        
        // to check the bookID in database
        let findBook = await BookModel.findOne({ _id: bookId, isDeleted: false })
        if (!findBook) return res.status(404).send({ status: false, message: "bookId not found" })
        
        // taking reviewId from params
        let reviewId = req.params.reviewId
        if (!reviewId) { return res.status(400).send({ status: false, message: "Please enter reviewId" }) }
        
        // to validate the reviewId is valid or not 
        if (!Validator.isValidObjectId(reviewId)) { return res.status(400).send({ status: false, message: "Please enter valid reviewId" }) }
        
        // to check the bookID in database
        let findReview = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })
        console.log(findReview)
        if(bookId != findReview.bookId)return res.status(404).send({ status: false, message: "reviewId is not of this Book Id" })
        
        // console.log(dbcall)
        if (!findReview) return res.status(404).send({ status: false, message: "reviewId not found" })

        // taking value from request body
        let requestBody = req.body
        
        // to check the request body is present
        if (!Validator.isvalidRequestBody(requestBody)) { return res.status(400).send({ status: false, msg: 'Please enter the value to update in review' }) }
        
        // to destructure of requestbody 
        let { reviewedBy, rating, review } = requestBody
        
        // to check the reviewer name is entered
        if (!reviewedBy) { return res.status(400).send({ status: false, message: "Please enter your name", }) }
      
        // to check rating is entered
        if (!rating) { return res.status(400).send({ status: false, message: "Rating is required", }) }
        if (typeof rating !== "number") {
            return res.status(400).send({
                status: false,
                message: "Rating must be number only",
            });
        }
        if (rating < 1 || rating > 5) {
            return res.status(400).send({
                status: false,
                message: "Rating must be 1 to 5",
            });
        }

        const reviewUpdate = await ReviewModel.findOneAndUpdate(
            { _id: reviewId, isDeleted: false },
            { $set: { rating: rating, review: review, reviewedBy: reviewedBy } }, { new: true })

        const getBook = await BookModel.findOne({ _id: bookId })

        let updatedReview = {
            "_id": getBook._id,
            "title": getBook.title,
            "excerpt": getBook.excerpt,
            "userId": getBook.userId,
            "category": getBook.category,
            "subcategory": getBook.subcategory,
            "isDeleted": getBook.isDeleted,
            "reviews": getBook.reviews,
            "reviewsData": reviewUpdate
        }
        return res.status(201).send({ status: true, msg: 'Book Status', data: updatedReview })
    }
    catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}

const deleteReview = async function (req, res) { 

    try {
         // taking bookid from params
         let bookId = req.params.bookId
         if (!bookId) { return res.status(400).send({ status: false, message: "Please enter bookId" }) }
         
         // to validate the bookId is valid or not 
         if (!Validator.isValidObjectId(bookId)) { return res.status(400).send({ status: false, message: "Please enter valid bookId" }) }
         
         // to check the bookID in database
         let findBook = await BookModel.findOne({ _id: bookId, isDeleted: false })
         if (!findBook) return res.status(404).send({ status: false, message: "bookId not found" })
         
         // taking reviewId from params
         let reviewId = req.params.reviewId
         if (!reviewId) { return res.status(400).send({ status: false, message: "Please enter reviewId" }) }
         
         // to validate the reviewId is valid or not 
         if (!Validator.isValidObjectId(reviewId)) { return res.status(400).send({ status: false, message: "Please enter valid reviewId" }) }
         
         // to check the reviewId in database
         let findReview = await ReviewModel.findOne({ _id: reviewId, isDeleted: false })
         
         // console.log(dbcall)
         if (!findReview) return res.status(404).send({ status: false, message: "reviewId not found" })

        const deleteReview=await ReviewModel.findOneAndUpdate({_id:reviewId},{isDeleted:true,deletedAt:Date.now()})
        if(deleteReview){
            await BookModel.findOneAndUpdate(
                { _id: bookId },
                { $inc: { reviews: -1 } }
            )
        }
        const deletedReview=await ReviewModel.find({
            _id:findReview._id}).select({
                __v: 0,
                createdAt: 0,
                updatedAt: 0,
            })
            res.status(201).send({ status: true, message: "Successfully Deleted", data: deletedReview });
    }
    catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}

module.exports = { createReview, updateReview, deleteReview }


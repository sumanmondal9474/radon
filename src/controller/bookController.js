const PasswordValidator = require('password-validator')
const BookModel = require('../models/bookModel')
const UserModel = require('../models/userModel')
const Validator = require('../validator/validator')
const ReviewModel = require('../models/reviewModel')


const createBook = async function (req, res) {
    try {

        const requestBody = req.body
        const { userId, title, ISBN, excerpt, category, subcategory } = requestBody
        // to validate the request body is presnt or not 
        if (!Validator.isvalidRequestBody(requestBody)) { return res.status(400).send({ status: false, msg: 'Please enter the userId ' }) }

        // to validate the userid
        if (!Validator.isValidObjectId(userId)) { return res.status(400).send({ status: false, msg: 'Please enter valid userId' }) }
        // to find the userid in our database
        const validUserId = await UserModel.findById({ _id: userId })
        if (!validUserId) { return res.status(400).send({ status: false, msg: 'This userid does not exist' }) }
        // validation starts
        // to check the title is present  
        if (!Validator.isValidBody(title)) { return res.status(400).send({ status: false, msg: 'Please enter the title' }) }
        // to check the titile from database
        const isDuplicatetitle = await BookModel.findOne({ title: title })
        if (isDuplicatetitle) { return res.status(400).send({ status: false, msg: 'This book is already present' }) }
        // to check the excerpt is present 
        if (!Validator.isValidBody(excerpt)) { return res.status(400).send({ status: false, msg: 'Please enter the excerpt' }) }
        // to check the ISBN is present  
        if (!Validator.isValidBody(ISBN)) { return res.status(400).send({ status: false, msg: 'Please enter the ISBN' }) }
        // to validate the ISBN
        if (!Validator.isValidISBN(ISBN)) { return res.status(400).send({ status: false, msg: 'Please enter valid ISBN' }) }
        // to check the ISBN from database
        const isDuplicateISBN = await BookModel.findOne({ ISBN: ISBN })
        if (isDuplicateISBN) { return res.status(400).send({ status: false, msg: 'This book ISBN is already present' }) }
        // to check the category is present  
        if (!Validator.isValidBody(category)) { return res.status(400).send({ status: false, msg: 'Please enter the category' }) }
        // to check the subcategory is present  
        if (!Validator.isValidBody(subcategory)) { return res.status(400).send({ status: false, msg: 'Please enter the subcategory' }) }
        // validation ends



        const createBook = await BookModel.create(requestBody)
        res.status(201).send({ status: true, msg: createBook })

    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }

}

const getBooks = async function (req, res) {
    try {
        const queryData = req.query;
        // console.log(queryData);
        let obj = {
            isDeleted: false,
        };

        if (Object.keys(queryData).length !== 0) {
            // userId=userId.toString()
            let { userId, category, subcategory } = queryData;

            if (userId) {
                if (!Validator.isValidObjectId(userId)) {
                    return res
                        .status(400)
                        .send({ status: false, message: "Invalid userId" });
                }
                obj.userId = userId;
            }
            if (category && Validator.isValidBody(category)) {
                obj.category = category;
            }

            if (subcategory && Validator.isValidBody(subcategory)) {
                obj.subcategory = { $in: subcategory };
            }
        }
        let find = await BookModel.find(obj).select({ title: 1, ISBN: 1, category: 1, releasedAt: 1, reviews: 1, }).sort({ title: 1 })
        if (find.length == 0) { return res.status(404).send({ status: false, message: "No such book found" }) }
        res.status(200).send({
            status: true,
            message: "Book List",
            data: find,
        });

    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}

const getbookparam = async function (req, res) {

    try {
        // taking bookid from params
        let result = req.params.bookId
        if (!result) { return res.status(400).send({ status: false, message: "Please enter bookId" }) }
        // to validate the bookId is valid or not 
        if (!Validator.isValidObjectId(result)) { return res.status(400).send({ status: false, message: "Please enter valid bookId" }) }
        // to check the bookId in database
        let dbcall = await BookModel.findOne({ _id: result })
        if (!dbcall) return res.status(400).send({ status: false, message: "This bookId not found" })


        let dbcell = await ReviewModel.find({ bookId: result,isDeleted:false })

        // destructured and stored the values 
        let dcall =
        {
            "_id": dbcall._id,
            "title": dbcall.title,
            "excerpt": dbcall.excerpt,
            "userId": dbcall.userId,
            "category": dbcall.category,
            "subcategory": dbcall.subcategory,
            "reviews": dbcall.reviews,
            "isDeleted": dbcall.isDeleted,
            "releasedAt": dbcall.releasedAt,
            "createdAt": dbcall.createdAt,
            "updatedAt": dbcall.updatedAt,
            "reviewsData": dbcell

        }

        // to return all books data with details
        return res.status(200).send({ status: true, message: " Books list", data: dcall })

    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }

}

const updateBooksById = async function (req, res) {
    try {
        // taking bookid from params
        let result = req.params.bookId
        if (!result) { return res.status(400).send({ status: false, message: "Please enter bookId" }) }
        // to validate the bookId is valid or not 
        if (!Validator.isValidObjectId(result)) { return res.status(400).send({ status: false, message: "Please enter valid bookId" }) }
        // to check the bookID in database
        let dbcall = await BookModel.findOne({ _id: result, isDeleted: false })
        // console.log(dbcall)
        if (!dbcall) return res.status(404).send({ status: false, message: "bookId not found" })

        // taking value from request body
        let requestBody = req.body
        // to check the request body is present
        if (!Validator.isvalidRequestBody(requestBody)) { return res.status(400).send({ status: false, msg: 'Please enter the value to update' }) }
        // to destructure of requestbody 
        let { title, excerpt, ISBN, releasedAt } = requestBody
        // if Title is present 
        if (title) {
            // to check the title is entered
            if (Validator.isValidBody(title)) { return res.status(400).send({ status: false, msg: 'Please enter the title' }) }
            // to check the title in database
            let checkTitle = await BookModel.findOne({ title: title })
            if (checkTitle) { return res.status(404).send({ status: false, message: "This Book title name is already present" }) }
        }
        // if ISBN is present 
        if (ISBN) {
            // to check the ISBN is entered
            if (Validator.isValidBody(ISBN)) { return res.status(400).send({ status: false, msg: 'Please enter the ISBN' }) }
            // to check the valid ISBN
            if (!Validator.isValidISBN(ISBN)) { return res.status(404).send({ status: false, message: "Please enter valid ISBN" }) }
            // to check the ISBN in database
            let checkISBN = await BookModel.findOne({ ISBN: ISBN })
            if (checkISBN) { return res.status(404).send({ status: false, message: "This Book ISBN is already present" }) }
        }
        // to update the book
        let updateBook = await BookModel.findOneAndUpdate({ _id: result }, { $set: { title: title, excerpt: excerpt, ISBN: ISBN, releasedAt: releasedAt } }, { new: true })
        return res.status(200).send({ status: true, message: 'Success', data: updateBook })
    } catch (err) {
        res.status(500).send({
            status: false,
            message: err.message
        })
    }
}

const deleteBooksById = async function (req, res) {
try{
    // taking bookid from params
    let result = req.params.bookId
    if (!result) { return res.status(400).send({ status: false, message: "Please enter bookId" }) }
    // to validate the bookId is valid or not 
    if (!Validator.isValidObjectId(result)) { return res.status(400).send({ status: false, message: "Please enter valid bookId" }) }
    // to check the bookID in database
    let dbcall = await BookModel.findOne({ _id: result, isDeleted: false })
    // console.log(dbcall)
    if (!dbcall) return res.status(404).send({ status: false, message: "bookId not found or book is already deleted" })

    const deletedBook=await BookModel.findOneAndUpdate({_id:result},{isDeleted:true},{new: true})
    return res.status(201).send({
        status:true,
        message:'Book Deleted successfully',
        data:deletedBook
    })

} catch (err) {
    res.status(500).send({
        status: false,
        message: err.message
    })
}
}


module.exports = {
    createBook,
    getBooks,
    getbookparam,
    updateBooksById,
    deleteBooksById
}



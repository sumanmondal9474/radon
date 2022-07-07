const BookModel = require('../models/bookModel')
const UserModel = require('../models/userModel')
const Validator = require('../validator/validator')
//const moment =require('moment')

const createBook = async function (req, res) {
    try {

        const requestBody = req.body
        const { userId, title, ISBN, excerpt, category, subcategory } = requestBody
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
        // to check the title is present  
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
        const data=req.query
        
        let allBooks = await BookModel.find({isDeleted:false,...data}).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).count()
        if (allBooks.length == 0) { return res.status(404).send({ status: false, msg: 'No such books find ' }) }

        return res.status(200).send({ status: true, msg: 'Book List', data: allBooks })

    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}






module.exports = {
    createBook,
    getBooks
}



// let userId = req.query.userId
//         let category = req.query.category
//         let subcategory = req.query.subcategory

//         let obj = {
//             isDeleted: false,
//         }
//         if (userId) {
//             obj.userId = userId
//         }
//         if (category) {
//             obj.category = category
//         }
//         if (subcategory) {
//             obj.subcategory = subcategory
//         }
//         if (Object.keys(obj).length == 0) {
//             return res.status(400).send({ status: false, msg: "Please enter the query" })
//         }
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
        if(!Validator.isValidISBN(ISBN)){ return res.status(400).send({ status: false, msg: 'Please enter valid ISBN' }) }
        // to check the ISBN from database
        const isDuplicateISBN = await BookModel.findOne({ ISBN: ISBN })
        if (isDuplicateISBN) { return res.status(400).send({ status: false, msg: 'This book ISBN is already present' }) }
        // to check the category is present  
        if (!Validator.isValidBody(category)) { return res.status(400).send({ status: false, msg: 'Please enter the category' }) }
        // to check the subcategory is present  
        if (!Validator.isValidBody(subcategory)) { return res.status(400).send({ status: false, msg: 'Please enter the subcategory' }) }
        // validation ends


      
        const createBook= await BookModel.create(requestBody)
        res.status(201).send({status:true,msg:createBook})

    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }

}


module.exports = { createBook }
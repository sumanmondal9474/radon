const authorModel = require("../models/authorModel")
const publisherModel = require("../models/publisherModel")
const bookModel= require("../models/bookModel.js")

const createBook= async function (req, res) {
    let book = req.body
    let book_auther_id=book.author_id
    let book_publisher_id=book.publisher_id

    //check author_id present in the request or not
    if(!book_auther_id) return res.send({error_message: "author_id detail is required"})

    //check author valid or not
    let valid_author= await authorModel.findById(book_auther_id)
    if(!valid_author) return res.send({error_message: "author not present"})
    
    //check publisher_id present in the request or not
    if(!book_publisher_id) return res.send({error_message: "publisher_id detail is required"})

    //check publisher valid or not
    let valid_publisher= await publisherModel.findById(book_publisher_id)
    if(!valid_publisher) return res.send({error_message: "publisher not present"})

    let bookCreated = await bookModel.create(book)
    res.send({data:bookCreated })
}

const getBooksData= async function (req, res) {
    let books = await bookModel.find()
    res.send({data: books})
}

const getBooksWithAuthorDetails = async function (req, res) {
    let specificBook = await bookModel.find().populate(['author_id','publisher_id'])
    res.send({data: specificBook})

}

const updateBook=async function(req,res){
    let body=req.body.name
    let isH=req.body.isHardClover
    let update =await bookModel.findOneAndUpdate({name:body},{$set:{isHardClover:isH}},{upsert:true})
    res.send(update)
}
module.exports.createBook= createBook
module.exports.getBooksData= getBooksData
module.exports.getBooksWithAuthorDetails = getBooksWithAuthorDetails
module.exports.updateBook= updateBook


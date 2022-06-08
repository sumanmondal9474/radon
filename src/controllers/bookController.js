const BooksModel= require("../models/bookModel")
const AuthorModel= require("../models/authorModel")


const createAuthors= async function (req, res) {
    let data= req.body
    let allAthor= await AuthorModel.create(data)
    res.send({msg: allAthor})
}



const createBooks = async function (req, res) {
    let data2= req.body
    let allBooks= await BooksModel.create(data2)
    res.send({msg: allBooks})
}

const getBooksbyChetanBhagat = async function (req, res) {
    let data = await AuthorModel.find({author_name :"Chetan Bhagat"}).select("author_id")
    let bookData = await BooksModel.find({author_id :data[0].author_id})
    res.send({msg :bookData})
}
const authorOfBook = async function (req, res) {
    let data = await BooksModel.findOneAndUpdate({name :"Two states"},{$set :{prices:100}},{new:true})
    let authorData =await AuthorModel.find({author_id:data.author_id}).select("author_name")
    let price =data.prices
    res.send({msg:authorData,price})
}

module.exports.createAuthors= createAuthors
module.exports.createBooks=createBooks 
module.exports.getBooksbyChetanBhagat=getBooksbyChetanBhagat 
module.exports.authorOfBook=authorOfBook

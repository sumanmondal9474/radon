const jwt = require('jsonwebtoken')
const UserModel=require('../models/userModel')
const BookModel=require('../models/bookModel')
const mongoose = require('mongoose')

const authenticate = function (req, res, next) {

    try {
        let token = req.headers['x-api-key']
        if (!token) res.status(400).send({ status: false, msg: "Please enter token" })
        let validtoken = jwt.verify(token, "Project-3 Book Management ")
        if (!validtoken) return res.status(402).send({ status: false, msg: "Please enter valid Token " })
        req.dtoken = validtoken
    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message,
        })
    }
    next()
}

const authorise =async function (req, res, next) {

    try {
        // to enter the token in header
        let token = req.headers['x-api-key']
        if (!token) res.status(400).send({ status: false, msg: "Please enter token" })
        // to decode the token 
        let decodedtoken = jwt.verify(token, "Project-3 Book Management ")
        if (!decodedtoken) return res.status(402).send({ status: false, msg: "Please enter valid Token " })
        
        // to take the bookUser
        let bookUser = req.params.bookId
        if (bookUser === ":bookId") return res.status(400).send({ status: false, msg: "Please enter bookId" })
        let findBookUser=await BookModel.findOne({_id:bookUser})
        if (!findBookUser) return res.status(402).send({ status: false, msg: "Please enter valid bookId" })
        // to find the user id through the bookId
        let findUser = await UserModel.findOne({_id:findBookUser.userId})
        // if (!findUser) return res.status(402).send({ status: false, msg: "Please enter valid bookId" })
        
        // to find userid from decoded token
        let userAuth=decodedtoken.userId
        // to check userid and decoded user is same or not 
        if (userAuth != findUser._id) return res.status(404).send({ status: false, msg: "Please login with your mail id " })
    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message,
        })
    }
    next()
}


module.exports = { authenticate, authorise }


const BookModel=require('../models/bookModel')
const UserModel=require('../models/userModel')
const Validator=require('../validator/validator')

const createBook = async function (req, res) {
    try {

        const requestBody=req.body
        if (!Validator.isvalidRequestBody(requestBody)) { return res.status(400).send({ status: false, msg: 'Please enter the userId ' }) }
        
        // to validate the userid
        if(!Validator.isValidObjectId(requestBody.userId)){return res.status(400).send({status:false,msg:'Please enter valid userId'})}
        res.send({msg:"hello"})

    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }

}


module.exports = { createBook }
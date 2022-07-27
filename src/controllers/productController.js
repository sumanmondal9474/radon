const productModel = require('../models/productModel')
const aws = require('./awsController')
const valid = require('../middleware/validation')

const createProduct = function(req, res) {

    const { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments, ...rest } = req.body

    let final = {}

    if (Object.keys(rest).length > 0) {
        return res.status(400).send({ status: false, message: "Field Doesn't Exist" })
    }

    if (Object.keys(req.body).length == 0) {
        return res.status(400).send({ status: false, message: "Please enter some DETAILS!!!" })
    }


    let files = req.files
    if (files && files.length > 0) {
        let url = await aws.uploadFile(files[0])
        final.profileImages = url
    }



}
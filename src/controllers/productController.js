const productModel = require('../models/productModel')
const aws = require('./awsController')
const valid = require('../middleware/validation')

const createProduct = async function(req, res) {

    try {

        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments, ...rest } = req.body

        let final = {}

        if (Object.keys(rest).length > 0) {
            return res.status(400).send({ status: false, message: "Field Doesn't Exist" })
        }

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter some DETAILS!!!" })
        }



        if (!valid.isValidString(title)) {
            return res.status(400).send({ status: false, message: "Title not mentioned or not in correct format." })
        }
        if (!valid.validName.test(title)) {
            return res.status(400).send({ status: false, message: "Title should be in proper format!!!" });
        }
        let duplicateTitle = await productModel.findOne({ title: title })
        if (duplicateTitle) {
            return res.status(400).send({ status: false, message: "Title already exists, try with some other name." })
        }
        final.title = title



        if (!valid.isValidString(description)) {
            return res.status(400).send({ status: false, message: "Description not mentioned or not in correct format." })
        }
        final.description = description


        console.log(price)
        price = parseFloat(price)
        console.log(price)
        if (isNaN(price)) {
            return res.status(400).send({ status: false, message: "Price not mentioned or not in correct format." })
        }
        final.price = price


        if (currencyId) {
            if (!valid.isValidString(currencyId)) {
                return res.status(400).send({ status: false, message: "CurrencyId not mentioned or not in correct format." })
            }
            currencyId = currencyId.toUpperCase()
            if (currencyId !== "INR") {
                return res.status(400).send({ status: false, message: "Kindly enter the correct currencyId (INR)" })
            }
            final.currencyId = currencyId
        }


        if (currencyFormat) {
            if (!valid.isValidString(currencyFormat)) {
                return res.status(400).send({ status: false, message: "Currency Format not mentioned or not in correct format." })
            }
            if (currencyFormat !== "₹") {
                return res.status(400).send({ status: false, message: "Kindly enter the correct currencyId (₹)" })
            }
            final.currencyFormat = currencyFormat
        }



        if (isFreeShipping == true) {
            final.isFreeShipping = true
        }



        if (style) {
            if (!valid.isValidString(style)) {
                return res.status(400).send({ status: false, message: "Style not mentioned or not in correct format." })
            }
            final.style = style
        }



        console.log(availableSizes.length);
        const size = ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']
        if (availableSizes.length == 0) {
            return res.status(400).send({ status: false, message: `You have to select at least one size out of ${size}` })
        }
        availableSizes = availableSizes.split(',')

        availableSizes = availableSizes.map(x => x.toUpperCase())

        console.log(availableSizes)

        let a = (availableSizes.map(x => {
            if (size.includes(x)) return true
            else return false
        }))
        console.log(a)

        let b = a.includes(false)

        console.log(b)
        if (b) {
            return res.status(400).send({ status: false, message: `Enter the correct size as mentioned ${size}` })
        }
        final.availableSizes = availableSizes



        installments = parseInt(installments)
        if (isNaN(installments)) {
            return res.status(400).send({ status: false, message: "Installments not mentioned or not in correct format." })
        }
        final.installments = installments



        let files = req.files
        if (files && files.length > 0) {
            let url = await aws.uploadFile(files[0])
            final.productImage = url
        }


        const result = await productModel.create(final)

        return res.status(201).send({ status: true, message: "Product Successfully Created", data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



const getProductById = async(req, res) => {

    try {
        const productId = req.params.productId

        if (!valid.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "ProductId not valid" })
        }

        let productData = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productData) {
            return res.status(404).send({ status: false, message: "Product not exist" })
        }

        return res.status(200).send({ status: true, data: productData })


    } catch (err) {
        return res.status(500).send({ satus: false, err: err.message })
    }
}


const deleteProduct = async(req, res) => {

    try {
        const productId = req.params.productId

        if (!valid.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, message: "ProductId not valid" })
        }

        let productData = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!productData) {
            return res.status(404).send({ status: false, message: "Product not exist" })
        }

        await productModel.updateOne({ _id: productId }, { isDeleted: true, deletedAt: Date.now() })

        return res.status(200).send({ status: true, message: "Product Successfully Deleted" })


    } catch (err) {
        return res.status(500).send({ satus: false, err: err.message })
    }
}



const updateProduct = async(req, res) => {

    let productId = req.params.ProductId
    let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments, ...rest } = req.body

    if (Object.keys(rest).length > 0) {
        return res.status(400).send({ status: false, message: "Field Doesn't Exist" })
    }

    if (Object.keys(req.body).length == 0) {
        return res.status(400).send({ status: false, message: "Please enter some DETAILS!!!" })
    }


    if (!valid.isValidObjectId(productId)) {
        return res.status(400).send({ status: false, msg: "ProductId is Invalid" })
    }
    let productData = await productModel.findOne({ _id: productId, isDeleted: false })
    if (!productData) return res.status(404).send({ status: false, message: "No Product Found As per productId" })


    if (title) {
        if (!valid.isValidString(title)) {
            return res.status(400).send({ status: false, message: "Invalid title details" });
        }
        if (!valid.validName.test(title)) {
            return res.status(400).send({ status: false, message: "Title should be in proper format!!!" });
        }
        let findTitle = await productModel.findOne({ title: title })
        if (findTitle) return res.status(400).send({ status: false, message: "Title already exist" })
    }



    if (description) {
        if (!valid.isValidString(description)) {
            return res.status(400).send({ status: false, message: "invalid description details" });
        }
    }



    if (price) {
        price = parseFloat(price)
        if (isNAN(price)) {
            return res.status(400).send({ status: false, message: "Invalid price details" });
        }
    }


    if (currencyId) {
        if (!valid.isValidString(currencyId)) {
            return res.status(400).send({ status: false, message: "CurrencyId not mentioned or not in correct format." })
        }
        currencyId = currencyId.toUpperCase()
        if (currencyId !== "INR") {
            return res.status(400).send({ status: false, message: "Kindly enter the correct currencyId (INR)" })
        }
    }



    if (currencyFormat) {
        if (!valid.isValidString(currencyFormat)) {
            return res.status(400).send({ status: false, message: "Currency Format not mentioned or not in correct format." })
        }
        if (currencyFormat !== "₹") {
            return res.status(400).send({ status: false, message: "Kindly enter the correct currencyId (₹)" })
        }
    }


    if (style) {
        if (!valid.isValidString(style)) {
            return res.status(400).send({ status: false, message: "Invalid style details" });
        }
    }


    if (availableSizes) {
        console.log(availableSizes);
        const size = ['S', 'XS', 'M', 'X', 'L', 'XXL', 'XL']

        if (availableSizes.length == 0) {
            return res.status(400).send({ status: false, message: `You have to select at least one size out of ${size}` })
        }
        availableSizes = availableSizes.split(',')

        availableSizes = availableSizes.map(x => x.toUpperCase())

        console.log(availableSizes);

        let a = (availableSizes.map(x => {
            if (size.includes(x)) return true
            else return false
        }))
        let b = a.includes(false)

        if (b) {
            return res.status(400).send({ status: false, message: `Enter the correct size as mentioned ${size}` })
        }
    }



    if (isFreeShipping) {

        isFreeShipping = parseBoolean(isFreeShipping)
        if (!isBoolean(isFreeShipping)) {
            return res.status(400).send({ status: false, message: "FreeShipping must have value of either True or False" });
        }

    }



    if (installments) {
        installments = parseInt(installments)
        if (isNaN(installments)) {
            return res.status(400).send({ status: false, message: "Invalid installments details" });
        }
    }


    let productImg = req.files;
    if (productImg && productImg.length > 0) {
        const productImageLink = await aws.uploadFile(productImg[0])
        req.body.productImage = productImageLink
    }

    let updatedproduct = await productModel.findByIdAndUpdate(productId, req.body, { new: true })
    return res.status(200).send({ status: true, data: updatedproduct })
}



const getQueryProduct = async(req, res) => {

    try {

        let { size, name, priceGreaterThan, priceLessThan, ...rest } = req.query


        let final = {}

        if (Object.keys(rest).length > 0) {
            return res.status(400).send({ status: false, message: "Field Doesn't Exist" })
        }

        if (Object.keys(req.query).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter some DETAILS!!!" })
        }

        console.log(size)

        if (size) {
            if (!valid.isValidString(size)) {
                return res.status(400).send({ status: false, message: "Size not mentioned or not in correct format." })
            }
            size = size.split(',')
            console.log(size)
            final.availableSize = { $in: size }
        }
        console.log(final)

        if (name) {
            if (!valid.isValidString(name)) {
                return res.status(400).send({ status: false, message: "Name not mentioned or not in correct format." })
            }
            if (!valid.validName.test(name)) {
                return res.status(400).send({ status: false, message: "Name not in correct format." })
            }

            const titleCheck = await productModel.findOne({ title: name, isDeleted: false })
            if (!titleCheck) return res.status(404).send({ status: false, message: "Product not exsit with name " + name })
            final.title = name
        }

        if (priceGreaterThan && priceLessThan) {
            final.price = {
                $gt: { price: priceGreaterThan },
                $lt: { price: priceLessThan }
            }
        }
        if (priceGreaterThan || priceLessThan) {
            if (priceGreaterThan) {
                final.price = { $gt: { price: priceGreaterThan } }
            }
            if (priceLessThan) {
                final.price = { $lt: { price: priceLessThan } }
            }
        }

        const result = await productModel.find(final)

        return res.status(200).send({ status: true, data: result })
    } catch (err) {
        return res.status(500).send({ satus: false, error: err.message })
    }
}


module.exports.createProduct = createProduct
module.exports.getQueryProduct = getQueryProduct
module.exports.getProductById = getProductById
module.exports.updateProduct = updateProduct
module.exports.deleteProduct = deleteProduct
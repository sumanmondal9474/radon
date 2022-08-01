const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const valid = require('../middleware/validation')

const createCart = async function(req, res) {

    try {

        const userId = req.params.userId

        let { productId, quantity } = req.body

        let final = {}

        final.userId = userId

        if (!valid.isValidString(productId)) {
            return res.status(400).send({ status: false, Message: "ProductId not mentioned or not in correct format." })
        }
        if (!valid.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, Message: "Invalid ProductID" })
        }
        const product = await productModel.findById(productId)
        if (!product) {
            return res.status(404).send({ status: false, Message: "Product not available." })
        }

        if (quantity) {

            if (!valid.isValidNumber(quantity)) {
                return res.status(400).send({ status: false, Message: "Quantity not mentioned or not in correct format." })
            }
            if (quantity < 1) {
                return res.status(400).send({ status: false, Message: "Minimum 1 Quantity" })
            }
            req.body.quantity = quantity

        } else {
            req.body.quantity = 1
        }


        let cartAvailable = await cartModel.findOne({ userId: userId })

        if (cartAvailable) {
            if (quantity == undefined) {
                quantity = 1
            }

            let ans = (cartAvailable.items).map(x => {
                if (x.productId == productId) return true
                else return false
            })

            let final = {}

            if (ans.includes(true)) {

                let oldQuantityIndex = cartAvailable.items.findIndex(x => { if (x.productId == productId) return x })

                let newQuantity = cartAvailable.items[oldQuantityIndex].quantity + quantity

                final["items.$.quantity"] = newQuantity

                final.totalPrice = cartAvailable.totalPrice + (product.price * quantity)

                let result = await cartModel.findOneAndUpdate({ "items.productId": productId }, final, { new: true })

                return res.status(200).send({ status: false, message: "The product added.", data: result })

            } else {

                final["$push"] = { items: req.body }

                final.totalPrice = (cartAvailable.totalPrice + (product.price * quantity))

                final.totalItems = (cartAvailable.totalItems + 1)

                let result = await cartModel.findOneAndUpdate({ userId: userId }, final, { new: true })

                return res.status(200).send({ status: false, message: "The product added.", data: result })
            }
        }


        final.items = [req.body]
        final.totalPrice = (product.price * req.body.quantity)
        final.totalItems = 1


        let result = await cartModel.create(final)

        return res.status(201).send({ status: false, message: "Cart Successfully Created", data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}





const getCart = async function(req, res) {
    try {
        const userId = req.params.userId

        const checkCart = await cartModel.findOne({ userId: userId }).populate('items.productId')
        if (!checkCart) {
            return res.status(404).send({ status: false, Message: 'cart not found ' })
        }

        res.status(200).send({ status: true, Message: 'success', data: checkCart })

    } catch (error) {
        res.status(500).send({ status: false, Message: error.message })
    }
}

const deleteCart = async function(req, res) {
    try {
        const userId = req.params.userId

        const checkCart = await cartModel.findOne({ userId: userId })
        if (!checkCart) {
            return res.status(400).send({ status: false, Message: 'cart not found ' })
        }
        await cartModel.findOneAndUpdate({ userId: userId }, { items: [], totalPrice: 0, totalItems: 0 })

        res.status(200).send({ status: true, Message: 'sucessfully deleted' })

    } catch (error) {
        res.status(500).send({ status: false, Message: error.message })
    }
}

module.exports.createCart = createCart
    //module.exports.updateCart = updateCart
module.exports.getCart = getCart
module.exports.deleteCart = deleteCart
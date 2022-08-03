const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')
const valid = require('../middleware/validation')

const createCart = async function(req, res) {

    try {

        const userId = req.params.userId

        let { productId, quantity, ...rest } = req.body

        if (Object.keys(rest).length > 0) {
            return res.status(400).send({ status: false, message: "Unwanted Details Entered." })
        }

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter some DETAILS!!!" })
        }

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

                let result = await cartModel.findOneAndUpdate({ userId: userId, "items.productId": productId }, final, { new: true })

                return res.status(200).send({ status: true, message: "The product added.", data: result })

            } else {

                final["$push"] = { items: req.body }

                final.totalPrice = (cartAvailable.totalPrice + (product.price * quantity))
                final.totalItems = (cartAvailable.totalItems + 1)

                let result = await cartModel.findOneAndUpdate({ userId: userId }, final, { new: true })

                return res.status(200).send({ status: true, message: "The product added.", data: result })
            }
        }


        final.items = [req.body]
        final.totalPrice = (product.price * req.body.quantity)
        final.totalItems = 1


        let result = await cartModel.create(final)

        return res.status(201).send({ status: true, message: "Cart Successfully Created", data: result })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const updateCart = async(req, res) => {

    try {
        let userId = req.params.userId

        let { cartId, productId, removeProduct, ...rest } = req.body

        if (Object.keys(rest).length > 0) {
            return res.status(400).send({ status: false, message: "Unwanted Details Entered." })
        }

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter some DETAILS!!!" })
        }



        if (!valid.isValidString(productId)) {
            return res.status(400).send({ status: false, messege: "ProductId not mentioned or not in correct format." })
        }
        if (!valid.isValidObjectId(productId)) {
            return res.status(400).send({ status: false, messege: "Invalid ProductId" })
        }
        let product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) {
            return res.status(404).send({ status: false, message: "Product not found" })
        }



        if (!valid.isValidString(cartId)) {
            return res.status(400).send({ status: false, messege: "CartId not mentioned or not in correct format." })
        }
        if (!valid.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, messege: "Invalid CartId" })
        }
        let cartAvailable = await cartModel.findOne({ _id: cartId, userId: userId })


        if (!cartAvailable) {
            return res.status(404).send({ status: false, message: "Cart Not Found" })
        }


        let productCart = await cartModel.findOne({ _id: cartId, userId: userId }, { items: { $elemMatch: { productId: productId } } })
        if (!productCart) {
            return res.status(400).send({ status: false, message: 'Product does not exists in the cart' })
        }


        removeProduct = parseInt(removeProduct)
        if (!/^[0-1]$/.test(removeProduct)) {
            return res.status(400).send({ status: false, messege: "RemoveProduct should be Either 0 or 1" })
        }



        let productIndex = cartAvailable.items.findIndex(x => { if (x.productId = productId) return x })


        if (productIndex == -1) {
            return res.status(404).send({ status: false, messege: "The product is not avaialble in this cart." })
        }

        if (removeProduct == 0) {

            let f = {}

            f["$pull"] = { items: { productId: productId } }
            f.totalPrice = cartAvailable.totalPrice - (cartAvailable.items[productIndex].quantity * product.price)
            f.totalItems = cartAvailable.totalItems - 1

            let result = await cartModel.findOneAndUpdate({ "items.productId": productId }, f, { new: true }).populate('items.productId', { title: 1, price: 1, productImage: 1 })

            return res.status(200).send({ status: true, messege: "Product Removed", data: result })

        }


        if (removeProduct == 1) {

            let final = {}

            if (cartAvailable.items[productIndex].quantity == 1) {

                final["$pull"] = { items: { productId: productId } }
                final.totalPrice = cartAvailable.totalPrice - product.price
                final.totalItems = cartAvailable.totalItems - 1

                let result = await cartModel.findOneAndUpdate({ "items.productId": productId }, final, { new: true }).populate('items.productId', { title: 1, price: 1, productImage: 1 })

                return res.status(200).send({ status: true, messege: "Product Removed", data: result })

            } else {

                final["$inc"] = { "items.$.quantity": -1 }
                final.totalPrice = cartAvailable.totalPrice - product.price

                let result = await cartModel.findOneAndUpdate({ "items.productId": productId }, final, { new: true }).populate('items.productId', { title: 1, price: 1, productImage: 1 })

                return res.status(200).send({ status: true, messege: "Quantity reduced", data: result })
            }
        }

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


const getCart = async function(req, res) {

    try {
        const userId = req.params.userId

        const checkCart = await cartModel.findOne({ userId: userId }).populate('items.productId', { title: 1, price: 1, productImage: 1 })

        if (!checkCart) {
            return res.status(404).send({ status: false, Message: 'Cart not found ' })
        }

        res.status(200).send({ status: true, message: 'Success', data: checkCart })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const deleteCart = async function(req, res) {

    try {
        const userId = req.params.userId

        const checkCart = await cartModel.findOne({ userId: userId })

        if (!checkCart) {
            return res.status(400).send({ status: false, Message: 'Cart not found ' })
        }

        await cartModel.findOneAndUpdate({ userId: userId }, { items: [], totalPrice: 0, totalItems: 0 })

        return res.status(204).send({ status: true, message: 'Sucessfully deleted' })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports.createCart = createCart
module.exports.updateCart = updateCart
module.exports.getCart = getCart
module.exports.deleteCart = deleteCart


//diff between programming and scripting language, javascript is:-
//1. Single Threaded
//2. Synchronous
//3. Non Blocking
//Javascript language is scription language (do not need compilation)
//Javascript used in front end How? (dynamic way of used), used to make user interaction and event handling as when we scroll of mousue
//Javascript used in front end How? (dynamic way of used), used to make user interaction and event handling as when we scroll of mousue
//Javascript used in front end How? (dynamic way of used), used to make user interaction and event handling as when we scroll of mousue
//Javascript used in front end How? (dynamic way of used), used to make user interaction and event handling as when we scroll of mousue
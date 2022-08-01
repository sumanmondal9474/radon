const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')


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
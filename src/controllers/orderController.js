const cartModel = require('../models/cartModel')
const orderModel = require('../models/orderModel')
    // const productModel = require('../models/productModel')
    // const userModel = require('../models/userModel')
const valid = require('../middleware/validation');
const userModel = require('../models/userModel');

const createOrder = async function(req, res) {

    try {

        let data = req.body;

        const userId = req.params.userId

        const { cartId, cancellable, status, ...rest } = data

        if (Object.keys(rest).length > 0) {
            return res.status(400).send({ status: false, Message: 'Unwanted Details.' });
        }
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, Message: 'Please provide some details' });
        }


        if (!valid.isValidString(cartId)) {
            return res.status(400).send({ status: false, Message: 'Please provide cartId' })
        }
        if (!valid.isValidObjectId(cartId)) {
            return res.status(400).send({ status: false, Message: 'Please provide a valid cartId' })
        }


        const cart = await cartModel.findOne({ userId })
        if (!cart) {
            return res.status(404).send({ status: false, Message: 'Prior cart unavailable' })
        }
        if (cart._id != cartId) {
            return res.status(400).send({ status: false, Message: 'Cart does not belong to this user' })
        }

        if (cancellable) {
            if (typeof cancellable != 'boolean') {
                return res.status(400).send({ status: false, Message: 'You can only give TRUE or False value' })
            }
        }

        if (status) {
            if (status !== 'pending') {
                return res.status(400).send({ status: true, Message: 'Status can only be PENDING, or you do not need to add statu, it will be already updated. ' })
            }
        }


        let { items, totalPrice, totalItems } = cart

        let totalQuantity = 0;

        items.forEach(function(each) {
            totalQuantity += each.quantity
        })

        const Obj = { userId, items, totalPrice, totalItems, totalQuantity, cancellable }


        if (cart.items.length == 0) {
            return res.status(200).send({ status: true, Message: 'ORDER ALREADY CREATED' })
        }

        const createFinal = await orderModel.create(Obj)

        await cartModel.updateOne({ userId }, { items: [], totalPrice: 0, totalItems: 0 })

        return res.status(201).send({ status: true, Message: 'ORDER SUCCESSFULLY CREATED', data: createFinal })

    } catch (error) {
        res.status(500).send({ status: false, Message: error.message })
    }
}

const updateOrder = async function(req, res) {

    try {

        const userId = req.params.userId

        const data = req.body

        let { orderId, status, ...rest } = data

        if (Object.keys(rest).length > 0) {
            return res.status(400).send({ status: false, message: 'Unwanted Details.' });
        }
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: 'Please enter valid request Body' })
        }


        if (!valid.isValidString(orderId)) {
            return res.status(400).send({ status: false, message: 'Please provide orderId' })
        }
        if (!valid.isValidObjectId(orderId)) {
            return res.status(400).send({ status: false, message: 'Please provide valid orderId.' })
        }


        if (!valid.isValidString(status)) {
            return res.status(400).send({ status: false, message: 'Status required' })
        }
        status = status.toLowerCase()
        if (!["completed", "cancelled"].includes(status)) {
            return res.status(400).send({ status: false, message: 'Status should be only "completed" or "cancelled"' })
        }


        const cartId = await cartModel.findOne({ userId })
        if (!cartId) {
            return res.status(404).send({ status: false, message: `Cart does not exist for ${userId}` })
        }


        const userByOrder = await orderModel.findOne({ _id: orderId, userId })
        if (!userByOrder) {
            return res.status(404).send({ status: false, message: `Order does not exist for ${userId}` })
        }


        if (userByOrder.status == 'completed' || userByOrder.status == 'cancelled') {
            return res.status(200).send({ status: false, message: "The status is already updated." })
        }

        if (status == "cancelled") {
            if (userByOrder.cancellable == false) {
                return res.status(400).send({ status: false, message: "This order can't be cancelled because it is not allowed" })
            }
        }

        const updateOrder = await orderModel.findOneAndUpdate({ _id: orderId, userId }, { status }, { new: true })

        return res.status(200).send({ status: true, message: "Order updated successfully", data: updateOrder })

    } catch (error) {
        res.status(500).send({ status: false, Message: error.message })
    }
}
module.exports.createOrder = createOrder
module.exports.updateOrder = updateOrder
const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const cartSchema = new mongoose.Schema({
    userId: {
        type: ObjectId,
        ref: "User",
        require: true,
        unique: true,
        trim: true,
    },
    items: [{
        productId: {
            type: ObjectId,
            ref: "Product",
            require: true,
            trim: true,
        },
        quantity: {
            type: Number,
            require: true,
            min: 1,
            trim: true
        }
    }],
    totalPrice: {
        type: Number,
        require: true,
        trim: true,
        comment: "Holds total price of all the items in the cart"

    },
    totalItems: {
        type: Number,
        require: true,
        comment: "Holds total number of items in the cart",
        trim: true,
    }

}, { timestamps: true })

module.exports = mongoose.model("Cart", cartSchema),
const mongoose = require("mongoose")
const ObjectId = mongoose.Schema.Types.ObjectId
const orderSchema = new mongoose.Schema({

    userId: {
        type: ObjectId,
        ref: "User",
        require: true
    },
    items: [{
        productId: {
            type: ObjectId,
            ref: "Product",
            require: true
        },
        quantity: {
            type: Number,
            require: true,
            min: 1
        }
    }],
    totalPrice: {
        type: Number,
        require: true,
        comment: "Holds total price of all the items in the cart"
    },
    totalItems: {
        type: Number,
        require: true,
        comment: "Holds total number of items in the cart"
    },
    totalQuantity: {
        type: Number,
        require: true,
        comment: "Holds total number of quantity in the cart"
    },
    cancellable: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "completed", "cancled"]
    },
    deletedAt: Date.now,
    isDeleted: {
        type: Boolean,
        default: false
    }


}, { timestamp: true })

module.exports = mongoose.model("Order", orderSchema)
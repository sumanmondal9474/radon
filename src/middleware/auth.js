const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const valid = require("./validation")


exports.authentication = async function(req, res, next) {
    try {
        let token = req.headers.authorization
            //'Bearer Token'
        if (typeof token == 'undefined' || typeof token == 'null') {
            return res.status(400).send({ status: false, msg: "Token must be present, not available." })
        }

        let bearerToken = token.split(' ') //[Bearer, Token]
        let Token = bearerToken[1]

        jwt.verify(Token, "MeNeSunRa-radon", function(error, data) {
            if (error) {
                return res.status(401).send({ status: false, message: error.message });
            } else {
                req.decodedToken = data
                next()
            }
        })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

exports.authorization = async function(req, res, next) {

    const tokenUserId = req.decodedToken.userId
    const userId = req.params.userId

    if (userId) {

        if (!valid.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid UserID." })
        }

        const checkUserId = await userModel.findOne({ _id: userId })
        if (!checkUserId) {
            return res.status(404).send({ status: false, message: "User Not Found" })
        }

        if (userId !== tokenUserId) {
            return res.status(403).send({ status: false, message: "You are not Authorize." })
        }
        next()
    }
}
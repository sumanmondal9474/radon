const { count } = require("console")
const userModel= require("../models/oderModel")

const createOrder= async function (req, res) {
    let data = req.body
    let userModel = data.userModel
    if(userModel) return res.send({msg:'userModel is mandatory in the request'})
    let savedData= await userModel.create(data)
    res.send({data: savedData})
}

module.exports.createOrder= createOrder
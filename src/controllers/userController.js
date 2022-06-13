const { count } = require("console")
const userModel= require("../models/usermodel")






const createUser= async function (req, res) {
    let data = req.body
  
    let savedData= await userModel.create(data)
    res.send({data: savedData})
}

module.exports.createUser= createUser
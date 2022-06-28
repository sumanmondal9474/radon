const collegeModel = require("../models/collegeModel");

let createCollege= async function(req,res){
    let bodyData=req.body
    let data=await collegeModel.create(bodyData)
    res.status(201).send({status:true,data: data})
}
module.exports.createCollege=createCollege
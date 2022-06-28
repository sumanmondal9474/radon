const collegeModel = require("../models/collegeModel");

let createCollege= async function(req,res){
    let bodyData=req.body
    let data=await collegeModel.create(bodyData)
    res.status(201).send({status:true,data: data})
}


const collegedetail = async function(req,res){

let data1 = req.query.name
let data2 = req.query.fullName
let college = await collegeModel.findOne({$or:[{data1},{data2}]})
res.status(200).send({status:true, data:college}) 


}

module.exports.createCollege=createCollege
module.exports.collegedetail=collegedetail

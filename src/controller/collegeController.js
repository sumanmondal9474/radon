const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");
let createCollege= async function(req,res){
    let bodyData=req.body
    let data=await collegeModel.create(bodyData)
    res.status(201).send({status:true,data: data})
}


const collegedetail = async function(req,res){

let data1 = req.query.name

let college = await collegeModel.findOne({data1 , isDeleted:false},{updatedAt:0,createdAt:0,isDeleted:0,__v:0}).lean()
let collegeId=college._id
let interns=await internModel.find({collegeId:collegeId})
college.interns=interns
delete college._id
res.status(200).send({data:college}) 


}

module.exports.createCollege=createCollege
module.exports.collegedetail=collegedetail

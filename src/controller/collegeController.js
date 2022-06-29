const collegeModel = require("../models/collegeModel");

let createCollege = async function (req, res) {
    try{
    let bodyData = req.body
    let { name, fullName, logoLink } = bodyData

    let checkname = await collegeModel.findOne({name:name})
    if (Object.keys(bodyData).length === 0) {
        return res.status(400).send({ status: false, msg: "please provide data" })
    }
if(!name){
    return res.status(400).send({ status: false, msg: "college name is missing" })
}
if(checkname){
    return res.status(400).send({ status: false, msg: "college name is alredy exist please enter unique college name" }) 
}
if(!fullName){
    return res.status(400).send({ status: false, msg: "college fullName is missing" })
}
if(!logoLink){
    return res.status(400).send({ status: false, msg: "college logoLink is missing" })
}

if(!/^([a-zA-z]){1,100}$/.test(name)){
    return res.status(400).send({ status: false, msg: "college name should not be a number or character" })
}
let collegecreate = await collegeModel.create(bodyData)

    res.status(201).send({ status: true, data:collegecreate})
}
catch(error){
    res.status(500).send({status:false,msg:error.message})
}
}


const collegedetail = async function (req, res) {

let data1 = req.query.name

let college = await collegeModel.findOne({data1 , isDeleted:false},{updatedAt:0,createdAt:0,isDeleted:0,__v:0}).lean()
let collegeId=college._id
let interns=await internModel.find({collegeId:collegeId})
college.interns=interns
delete college._id
res.status(200).send({data:college}) 


}

module.exports.createCollege = createCollege
module.exports.collegedetail = collegedetail

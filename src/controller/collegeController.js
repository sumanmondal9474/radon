const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

function validURL(myURL) {
    let regex = (/^(https:\/\/|http:\/\/)[a-zA-Z!_$]+\-[a-zA-Z]+\.[a-zA-Z3]+\.[a-z]+\-[a-z]+\-[1]+\.[a-z]+\.[com]+\/[radon]+\/[a-zA-Z]+\.(jpeg|jpg|png|gif|webp)$/)
    return regex.test(myURL)
 }
function trimall(alltrim){
    return alltrim.trim()
}



let createCollege = async function (req, res) {
    try{
        
    let bodyData = req.body
    let { name, fullName, logoLink } = bodyData
trimall(name);

trimall(fullName);

    let checkname = await collegeModel.findOne({name:name})
    if (Object.keys(bodyData).length === 0) {
        return res.status(400).send({ status: false, msg: "please provide data" })
    }
if(!name){
    return res.status(400).send({ status: false, msg: "college name is missing" })
}
if(!/^([a-zA-z]){1,100}$/.test(name)){
    return res.status(400).send({ status: false, msg: "college name should not be a number or symbol" })
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
if(!validURL(logoLink)){
    return res.status(400).send({status:false, msg:"url not valid"})
}

<<<<<<< HEAD
=======

>>>>>>> 0def639449f32502f1ed4ec9d116b537fad4daba
let collegecreate = await collegeModel.create(bodyData)

    res.status(201).send({ status: true, data:collegecreate})
}
catch(error){
    res.status(500).send({status:false,msg:error.message})
}
}


const collegedetail = async function (req, res) {

try{let data1 = req.query.name
if(!data1){
    return res.status(400).send({status:false,msg:"please provide college name"})
}
let checkname = await collegeModel.find({name:data1})
if(checkname.length==0){
    return res.status(400).send({status:false,msg:"please provide valid college name"})
}
let college = await collegeModel.findOne({name:data1 , isDeleted:false},{updatedAt:0,createdAt:0,isDeleted:0,__v:0}).lean()
let collegeId=college._id
let interns=await internModel.find({collegeId:collegeId},{_id:1,updatedAt:0,createdAt:0,isDeleted:0,__v:0,collegeId:0}).lean()

college.interns=interns
if(interns.length==0){return res.status(404).send({status:false , msg: "there is no intern from this college"})}
delete college._id
res.status(200).send({data:college}) }
catch(error){
    res.status(500).send({status:false,msg:error.message})
}

}

module.exports.createCollege = createCollege
module.exports.collegedetail = collegedetail


        
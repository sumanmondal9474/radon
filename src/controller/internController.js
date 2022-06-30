const { find } = require("../models/internModel");
const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel")
const mongoose =  require("mongoose")
const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false
  if (typeof value === String && value.trim().length === 0) return false
  return true;
}


let createInterns = async function (req, res) {
  
    let bodyData = req.body
    let { name, email, mobile, collegeId } = bodyData
   
    if (Object.keys(bodyData).length === 0) {
      return res.status(400).send({ status: false, msg: "please provide data" })
    }
    if(!name.trim()|| !email.trim() ){
      return res.status(400).send({status:false,msg:"please dont give space " })}

      let space = name.trim()
      if(space!=name){
        return res.status(400).send({status:false,msg:"please dont give space " })
      }
  
    if(!mongoose.isValidObjectId(collegeId)){ return res.status(400).send({status:false, msg: "invalid college id"})}
    let checkemail = await internModel.findOne({ email: email })
    let checkmobile = await internModel.findOne({ mobile: mobile })
    let checkCollegeId = await collegeModel.find({_id:collegeId})
   
    if (!isValid(name)) {
      return res.status(400).send({ status: false, message: "name is missing" })
    }
    if (!/^([A-Za-z ]){1,100}$/.test(name)) {
      return res.status(400).send({ status: false, msg: "please enter valid name" })
    }
    if (checkemail) {
      return res.status(400).send({ status: false, msg: "email is already exist enter a unique email id" })
    }
    if (!email) {
      return res.status(400).send({ status: false, msg: "email is required" })
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)) {
      return res.status(400).send({ status: false, msg: "write a valid email id" })
    }
     if(!mobile){
      return res.status(400).send({ status: false, msg: "mobile number is missing" })
     }
    if (checkmobile)
      return res.status(400).send({ status: false, msg: "mobile number is already exist enter a unique mobile number" })
    if (!/^([0-9]){10}$/.test(mobile)) {
      return res.status(400).send({ status: false, msg: " please provide valid mobile number" })
    }
    if (checkCollegeId.length === 0) {
      return res.status(400).send({ status: false, msg: "please provide college id" })
    }
  

    let data = await internModel.create(bodyData)

    return res.status(201).send({ status: true, data: data })
  
}



module.exports.createInterns = createInterns

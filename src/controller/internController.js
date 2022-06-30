
const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel")
const mongoose = require("mongoose")




let createInterns = async function (req, res) {
  try {

    let bodyData = req.body

    let name = bodyData.name
    let email = bodyData.email
    let { mobile, collegeId } = bodyData


    if (Object.keys(bodyData).length === 0) {
      return res.status(400).send({ status: false, message: "please provide data" })
    }
    if (!mongoose.isValidObjectId(collegeId)) { return res.status(400).send({ status: false, message: "invalid college id" }) }
    if (!name) {
      return res.status(400).send({ status: false, message: "name is missing " })
    }
    if (!name.trim() || !email.trim()) {
      return res.status(400).send({ status: false, message: "please provide valid name" })
    }
    if (!/^([A-Za-z ]){1,100}$/.test(name)) {
      return res.status(400).send({ status: false, message: "please enter valid name" })
    }

    let checkemail = await internModel.findOne({ email: email })

    if (!email || email.trim() == undefined) {
      return res.status(400).send({ status: false, message: "email is required" })
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)) {
      return res.status(400).send({ status: false, message: "write a valid email id" })
    }
    if (checkemail) {
      return res.status(400).send({ status: false, message: "email is already exist enter a unique email id" })
    }

    let checkmobile = await internModel.findOne({ mobile: mobile })
    if (!mobile) {
      return res.status(400).send({ status: false, message: "mobile number is missing" })
    }
    if (!/^([0-9]){10}$/.test(mobile)) {
      return res.status(400).send({ status: false, message: " please provide valid mobile number" })
    }
    if (checkmobile){
      return res.status(400).send({ status: false, message: "mobile number is already exist enter a unique mobile number" })
    }

    let checkCollegeId = await collegeModel.findOne({ _id: collegeId })
    
    
    if (!collegeId) {
      return res.status(400).send({ status: false, message: "please provide college id" })
    }
    

    if (!checkCollegeId) {
      return res.status(400).send({ status: false, message: "college id doesnot exists" })
    }

    let data = await internModel.create(bodyData)
    let finddata = await internModel.findOne({name:name},{_id:0, __v:0})
    

    return res.status(201).send({ status: true, data:finddata})

  }
  catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}




module.exports.createInterns = createInterns

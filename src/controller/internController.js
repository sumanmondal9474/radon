
const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel")
const mongoose = require("mongoose");
const { findOne } = require("../models/internModel");




let createInterns = async function (req, res) {
  try {

    let bodyData = req.body
    let {name,email, mobile, collegeName } = bodyData


    if (Object.keys(bodyData).length === 0) {
      return res.status(400).send({ status: false, message: "please provide data" })
    }
    
   
    
    if (!name) {
      return res.status(400).send({ status: false, message: "name is missing " })
    }
    
    if (!/^([A-Za-z ]){1,100}$/.test(name)) {
      return res.status(400).send({ status: false, message: "please enter valid name" })
    }

    let checkemail = await internModel.findOne({ email: email })

    if (!email) {
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

   
    let checkCollegeName = await collegeModel.findOne({ name: collegeName })
    
    if (!collegeName) {
      return res.status(400).send({ status: false, message: "please provide college name" })
    }
    
    if(!/^([a-zA-z ]){1,100}$/.test(name)){
      return res.status(400).send({ status: false, message: "college name should not be a number or symbol" })
  }

    if (!checkCollegeName) {
      return res.status(400).send({ status: false, message: "college name doesnot exists" })
    }
    let collegeData= await collegeModel.findOne({name:collegeName})
    let collegeId=collegeData._id
    let data={}
    data.name=name
    data.email=email
    data.mobile=mobile
    data.collegeId=collegeId
   
    let internData= await internModel.create(data)
    let responseInternData= await internModel.findOne(data,{_id:0,__v:0}) 
    return res.status(201).send({ status: true, data: responseInternData})
    

  }
  catch (error) {
    res.status(500).send({ status: false, message: error.message })
  }
}









module.exports.createInterns = createInterns

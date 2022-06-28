const internModel = require("../models/internModel");

let createInterns= async function(req,res){
    let bodyData=req.body
    let email=req.body.email
    let number=req.body.number
    if(!email){return res.status(400).send({status:false ,msg: "email is required"})}
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)){return res.status(400).send({status: false, msg: "write a valid email id"})}
    if(!number){return res.status(400).send({status:false ,msg: "number is required"})}
    if(!(/^([+]\d{2})? \d{10}$/).test(number)){return res.status(400).send({status: false, msg: "write a valid mobile number"})}
    
    let data=await internModel.create(bodyData)
    res.status(201).send({status:true,data:data})

}
module.exports.createInterns=createInterns
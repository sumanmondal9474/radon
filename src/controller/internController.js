const internModel = require("../models/internModel");

let createInterns= async function(req,res){
    let bodyData=req.body
    let email=req.body.email
     
    if(!email){return res.status(400).send({status:false ,msg: "email is required"})}
    if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).test(email)){return res.status(400).send({status: false, msg: "write a valid email id"})}
    let data=await internModel.create(bodyData)
    res.status(201).send({status:true,data:data})

}
module.exports.createInterns=createInterns
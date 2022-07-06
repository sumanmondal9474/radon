const UserModel = require('../models/userModel')
const Validator = require('../validator/validator')
const jwt = require('jsonwebtoken')

const createUser = async function (req, res) {

    try {
        const data = req.body
        if (!Validator.isvalidRequestBody(data)) { return res.status(400).send({ status: false, msg: 'Please enter the data in request body ' }) }
        const { title, name, phone, email, password, address } = data
        // to check the title is present or not 
        if (!Validator.isValidBody(title)) { return res.status(400).send({ status: false, msg: 'Please enter the title' }) }
        // to validate the enum 
        if (["Mr", "Mrs", "Miss"].indexOf(title) == -1) { return res.status(400).send({ status: false, msg: 'Please select the title in Mr Mrs & Miss' }) }
        // to check the name is present 
        if (!Validator.isValidBody(name)) { return res.status(400).send({ status: false, msg: 'Please enter the Name' }) }
        // to check the phone Number is Prsent
        if (!Validator.isValidBody(phone)) { return res.status(400).send({ status: false, msg: 'Please enter the Mobile Number' }) }
        // to validate the mobile number 
        if (!Validator.isValidMobileNumber(phone)) { return res.status(400).send({ status: false, msg: 'Please enter valid Mobile Number' }) }
        // to validate the number in database
        const isDuplicateNumber = await UserModel.find({ phone: phone })
        if (isDuplicateNumber.length != 0) { return res.status(400).send({ status: false, msg: 'This number is already exist' }) }
        // to check the email is present 
        if (!Validator.isValidBody(email)) { return res.status(400).send({ status: false, msg: 'Please enter the Email Id' }) }
        // to validate the emailId 
        if (!Validator.isValidEmail(email)) { return res.status(400).send({ status: false, msg: 'Please enter valid emailId' }) }
        // to validate the email in database
        const isDuplicateEmail = await UserModel.find({ email: email })
        if (isDuplicateEmail.length != 0) { return res.status(400).send({ status: false, msg: 'This mailId is already exist' }) }
        // to check the password is Present
        if (!Validator.isValidBody(password)) { return res.status(400).send({ status: false, msg: 'Please enter the password' }) }
        // to validate the password in given length
        if (!Validator.isValidpassword(password)) { return res.status(400).send({ status: false, msg: "password should be have minimum 8 character and max 15 character" }) }


        const newUser = { title, name, phone, email, password, address }
        // to create the user
        const createdUser = await UserModel.create(newUser)
        res.status(201).send({ msg: "createddata", data: createdUser })

    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    };
}


const loginUser = async function (req, res) {

    const requestbody = req.body
    if (!Validator.isvalidRequestBody(requestbody)) { return res.status(400).send({ status: false, msg: 'Please enter mailId and password ' }) }
    const { email, password } = requestbody
    // to check the email is present 
    if (!Validator.isValidBody(email)) { return res.status(400).send({ status: false, msg: 'Please enter the Email Id' }) }
    // to validate the emailId 
    if (!Validator.isValidEmail(email)) { return res.status(400).send({ status: false, msg: 'Please enter valid emailId' }) }
    // to check the password is Present
    if (!Validator.isValidBody(password)) { return res.status(400).send({ status: false, msg: 'Please enter the password' }) }
    // to validate the password in given length
    if (!Validator.isValidpassword(password)) { return res.status(400).send({ status: false, msg: "password should be have minimum 8 character and max 15 character" }) }

    const user=await UserModel.findOne({email:email,password:password})
    if(!user) {return res.status(400).send({status:false,msg:'No such user found'})}

    let token =jwt.sign({
        userId:user._id.toString(),
        project: "Project-3",
        iat:Math.floor(Date.now() / 1000),
        exp:Math.floor(Date.now() / 1000) + 10*60*60
    }, "Project-3 Book Management ");
    res.setHeader('x-api-key',token)
    res.status(200).send({
        status:true,
        message:'Success',
        token:token
    })
}




module.exports = { createUser, loginUser };
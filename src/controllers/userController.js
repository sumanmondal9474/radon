const userModel = require('../models/userModel')
const valid = require('../middleware/validation')
const bcrypt = require('bcrypt')
const aws = require('./awsController')
const jwt = require('jsonwebtoken')

const createUser = async function(req, res) {

    try {
        let final = {}

        let { fname, lname, email, phone, password, address, ...rest } = req.body

        if (Object.keys(rest).length > 0) {
            return res.status(400).send({ status: false, message: "Unwanted Details Entered." })
        }

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter some DETAILS!!!" })
        }


        if (!valid.isValidString(fname)) {
            return res.status(400).send({ status: false, message: "fname not mentioned or not in correct format." })
        }
        if (!valid.validName.test(fname)) {
            return res.status(400).send({ status: false, message: "fname not in correct format." })
        }
        final.fname = fname


        if (!valid.isValidString(lname)) {
            return res.status(400).send({ status: false, message: "lname not mentioned or not in correct format." })
        }
        if (!valid.validName.test(lname)) {
            return res.status(400).send({ status: false, message: "lname not in correct format." })
        }
        final.lname = lname


        if (!valid.isValidString(email)) {
            return res.status(400).send({ status: false, message: "Email not mentioned or not in correct format." })
        }
        if (!valid.validEmail.test(email)) {
            return res.status(400).send({ status: false, message: "Email not valid." })
        }
        const duplicateEmail = await userModel.findOne({ email: email })
        if (duplicateEmail) {
            return res.status(400).send({ status: false, message: `${email} already registered.` })
        }
        final.email = email


        if (!valid.isValidString(phone)) {
            return res.status(400).send({ status: false, message: "Phone not mentioned or not in correct format." })
        }
        if (!valid.validPhone.test(phone)) {
            return res.status(400).send({ status: false, message: `${phone} is not valid.` })
        }
        const duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: `${phone} already registered.` })
        }
        final.phone = phone


        if (!valid.isValidString(password)) {
            return res.status(400).send({ status: false, message: "Password not mentioned or not in correct format" })
        }
        if (!valid.validPassword.test(password)) {
            return res.status(400).send({ status: false, message: `The Password Length between (8-15)` })
        }

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        final.password = hash


        if (Object.keys(address).length == 0) {
            return res.status(400).send({ status: true, message: "Address is mandatory." })
        }

        address = JSON.parse(address)

        if (typeof address !== 'object') {
            return res.status(400).send({ status: true, message: "Address is Invalid." })
        }


        if (Object.keys(address.shipping)[0] == 0 || Object.keys(address.shipping).length == 0) {
            return res.status(400).send({ status: false, message: `OPPS!!You Forgot to enter Shipping Address.` })
        }
        if (address.shipping) {

            const { street, city, pincode } = address.shipping

            if (!valid.isValidString(street)) {
                return res.status(400).send({ status: false, message: `Shipping Address Street is not mentiond or not valid.` })
            }
            if (!valid.isValidString(city)) {
                return res.status(400).send({ status: false, message: `Shipping Address City is not mentiond or not valid.` })
            }
            if (!valid.isValidNumber(pincode)) {
                return res.status(400).send({ status: false, message: `Shipping Address Pincode is not mentiond or not valid.` })
            }
            if (!valid.validPincode.test(pincode)) {
                return res.status(400).send({ status: false, message: `Shipping Address Pincode is not valid. ` })
            }
        }

        if (Object.keys(address.billing)[0] == 0 || Object.keys(address.billing).length == 0) {
            return res.status(400).send({ status: false, message: `OPPS!!You Forgot to enter Billing Address.` })
        }

        if (address.billing) {
            const { street, city, pincode } = address.billing

            if (!valid.isValidString(street)) {
                return res.status(400).send({ status: false, message: `Billing Address Street is not mentiond or not valid.` })
            }
            if (!valid.isValidString(city)) {
                return res.status(400).send({ status: false, message: `Billing Address City is not mentiond or not valid.` })
            }
            if (!valid.isValidNumber(pincode)) {
                return res.status(400).send({ status: false, message: `Billing Address Pincode is not mentiond or not valid.` })
            }
            if (!valid.validPincode.test(pincode)) {
                return res.status(400).send({ status: false, message: `Billing Address Pincode is not valid. ` })
            }
        }
        final.address = address


        let files = req.files
        if (files.length == 0) {
            return res.status(400).send({ status: false, message: "Profile Image in mandatory" })
        }
        if (files && files.length > 0) {
            let url = await aws.uploadFile(files[0])
            final.profileImage = url
        }



        const createUser = await userModel.create(final)

        return res.status(201).send({ status: true, message: "User created successfully", data: createUser })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}

//business logic
const loginUser = async function(req, res) {

    try {

        let { email, password } = req.body;


        if (!valid.isValidBody(req.body) == 0) {
            return res.status(400).send({ status: false, message: "Please enter data in request body" })
        }

        if (!email) {
            return res.status(400).send({ status: false, message: "Please enter email" })
        }

        if (!password) {
            return res.status(400).send({ status: false, message: "Please enter password " })

        }
        const user = await userModel.findOne({ email: email })
        if (!user) { return res.status(404).send({ status: false, message: "NO user found" }) }

        let encryptPwd = user.password

        let decryptPwd = await bcrypt.compare(password, encryptPwd, function(err, result) {

            if (result) {
                let token = jwt.sign({
                        userId: user._id.toString(),
                        iat: Math.floor(Date.now() / 1000),
                        exp: Math.floor(Date.now() / 1000) + 50 * 60 * 60,
                        batch: "radon",
                        organisation: "functionUp"
                    },
                    "MeNeSunRa-radon"
                )

                res.setHeader("Authorization", token)

                return res.status(200).send({ status: true, message: "User login successfull", data: { userId: user._id.toString(), token: token } })

            } else {
                return res.status(401).send({ status: false, message: "Invalid password!" });
            }

        })
    } catch (err) {
        return res.status(500).send({ satus: false, message: err.message })
    }
}


const getUser = async(req, res) => {
    try {
        let userId = req.params.userId

        let checkUser = await userModel.findById(userId)

        return res.status(200).send({ status: true, message: "User profile details", data: checkUser })

    } catch (err) {
        return res.status(500).send({ satus: false, message: err.message })
    }
}


const updateUser = async(req, res) => {
    try {

        let { fname, lname, email, profileImage, phone, password, address, ...rest } = req.body

        let userId = req.params.userId;

        let final = {}

        if (Object.keys(rest).length > 0) {
            return res.status(400).send({ status: false, message: "Field Doesn't Exist" })
        }

        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter some DETAILS!!!" })
        }

        let userdata = await userModel.findOne({ _id: userId })


        if (fname) {
            if (!valid.isValidString(fname)) {
                return res.status(400).send({ status: false, message: "invalid fname details" });
            }
            if (!valid.validName.test(fname)) {
                return res.status(400).send({ status: false, message: "fname should be in proper format!!!" });
            }
            final.fname = fname
        }


        if (lname) {
            if (!valid.isValidString(lname)) {
                return res.status(400).send({ status: false, message: "invalid lname details" });
            }
            if (!valid.validName.test(lname)) {
                return res.status(400).send({ status: false, message: "lname  should be in proper format!!!" });
            }
            final.lname = lname
        }


        if (email) {
            if (!valid.isValidString(email)) {
                return res.status(400).send({ status: false, message: "invalid email details" });
            }
            if (!valid.validEmail.test(email)) {
                return res.status(400).send({ status: false, message: "email  should be in proper format!!!" });
            }
            let uniqueEmail = await userModel.findOne({ email: email })
            if (uniqueEmail) {
                return res.status(400).send({ status: false, message: "Email already exist" })
            }
            final.email = email
        }


        if (phone) {
            if (!valid.isValidString(phone)) {
                return res.status(400).send({ status: false, message: "invalid phone details" });
            }
            if (!valid.validPhone.test(phone)) {
                return res.status(400).send({ status: false, message: `${phone} not in correct format.` })
            }
            let uniquePhone = await userModel.findOne({ phone: phone })
            if (uniquePhone) {
                return res.status(400).send({ status: false, message: "Phone Number already exist" })
            }
            final.phone = phone
        }


        if (password) {
            if (!valid.isValidString(password)) {
                return res.status(400).send({ status: false, message: "Invalid password details" });
            }
            if (!valid.validPassword.test(password)) {
                return res.status(400).send({ status: false, message: `${password} not in correct format.` })
            }
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)
            final.password = hash
        }

        if (address) {

            if (Object.keys(address).length == 0) {
                return res.status(400).send({ status: true, message: "Address is mandatory." })
            }
            address = JSON.parse(address)

            let useraddress = userdata.address;

            if (address.shipping) {
                let { street, city, pincode } = address.shipping
                if (street) {
                    if (!valid.isValidString(street)) {
                        return res.status(400).send({ status: true, message: "Street to update is not valid." })
                    }

                    useraddress.shipping.street = street
                }
                if (city) {
                    if (!valid.isValidString(city)) {
                        return res.status(400).send({ status: true, message: "City to update is not valid." })
                    }
                    useraddress.shipping.city = city
                }
                if (pincode) {
                    if (!valid.isValidNumber(pincode)) {
                        return res.status(400).send({ status: true, message: "Pincode to update is not valid." })
                    }
                    if (!valid.validPincode.test(pincode)) return res.status(400).send({ status: false, message: "Pincode should be six digit only" })

                    useraddress.shipping.pincode = pincode

                }

            }

            if (address.billing) {
                let { street, city, pincode } = address.billing
                if (street) {
                    if (!valid.isValidString(street)) {
                        return res.status(400).send({ status: true, message: "Street to update is not valid." })
                    }
                    useraddress.billing.street = street
                }
                if (city) {
                    if (!valid.isValidString(city)) {
                        return res.status(400).send({ status: true, message: "City to update is not valid." })
                    }
                    useraddress.billing.city = city
                }
                if (pincode) {
                    if (!valid.isValidNumber(pincode)) {
                        return res.status(400).send({ status: true, message: "Pincode to update is not valid." })
                    }
                    if (!valid.validPincode.test(pincode)) return res.status(400).send({ status: false, message: "Pincode should be six digit only" })

                    useraddress.billing.pincode = pincode


                }
            }

            final.address = useraddress
        }

        let profileImages = req.files
        if (profileImages && profileImages.length > 0) {
            let url = await aws.uploadFile(profileImages[0])
            final.profileImages = url
        }

        const updatedUser = await userModel.findOneAndUpdate({ _id: userId }, final, { new: true })

        return res.status(200).send({ status: true, message: "Successfully Updated", data: updatedUser })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}



module.exports.createUser = createUser
module.exports.loginUser = loginUser
module.exports.getUser = getUser
module.exports.updateUser = updateUser
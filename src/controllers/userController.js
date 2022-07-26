const userModel = require('../models/userModel')
const valid = require('../middleware/validation')
const bcrypt = require('bcrypt')
const aws = require('./awsController')
const jwt = require('jsonwebtoken')

const createUser = async function(req, res) {

    try {
        let final = {}

        final.profileImage = req.swap

        let { fname, lname, email, phone, password, address, ...rest } = req.body

        if (Object.keys(rest).length > 0) {
            return res.status(400).send({ status: false, message: "Unwanted Details Entered." })
        }


        if (Object.keys(req.body).length == 0) {
            return res.status(400).send({ status: false, message: "Kindly enter all the required details." })
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
            return res.status(400).send({ status: false, message: `The Password Length between 8-15)` })
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
        console.log(final)
        console.log(Object.keys(address.shipping))

        if (Object.keys(address.shipping).length == 0) {
            return res.status(400).send({ status: false, message: `OPPS!!You Forot to enter Shipping Address.` })
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

        if (Object.keys(address.billing).length == 0) {
            return res.status(400).send({ status: false, message: `OPPS!!You Forot to enter Billing Address.` })
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
        // const checkAddress = function(value) {

        //     if (valid.isValidBody(value)) {
        //         return res.status(400).send({ status: false, message: `OPPS!!You Forot to enter Address.` })
        //     }

        //     console.log(value)
        //     const { street, city, pincode } = value

        //     if (!valid.isValidString(street)) {
        //         return res.status(400).send({ status: false, message: `Address Street is not mentiond or not valid.` })
        //     }
        //     if (!valid.isValidString(city)) {
        //         return res.status(400).send({ status: false, message: `Address City is not mentiond or not valid.` })
        //     }
        //     if (!valid.isValidNumber(pincode)) {
        //         return res.status(400).send({ status: false, message: `Address Pincode is not mentiond or not valid.` })
        //     }
        //     if (!pincode) {
        //         return res.status(400).send({ status: false, message: `Address Pincode is not valid. ` })
        //     }
        // }
        // checkAddress(address.shipping)
        // checkAddress(address.billing)

        final.address = address
        console.log(final)
        const createUser = await userModel.create(final)
        return res.status(201).send({ status: true, message: "User created successfully", data: createUser })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const loginUser = async function(req, res) {

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

            return res.status(200).send({ status: true, message: "You are successfully loggedin", data: { userId: user._id.toString(), token: token } })
        } else {
            return res.status(401).send({ status: false, message: "Invalid password!" });
        }

    })
}

const getUser = async(req, res) => {
    try {
        let userId = req.params.userId

        if (!valid.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "UserId not valid" })
        }
        let checkUser = await userModel.findById(userId)

        if (!checkUser) {
            return res.status(404).send({ status: false, message: "User not exist" })
        }

        return res.status(200).send({ status: true, data: checkUser })

    } catch (err) {
        return res.status(500).send({ satus: false, error: err.message })
    }
}


const updateUser = async(req, res) => {
    try {
        let data = req.body;
        let { fname, lname, email, profileImage, phone, password, address, ...rest } = data;

        let userId = req.params.userId;

        let files = req.files
        console.log(files)
        if (files && files.length > 0) {
            let url = await aws.uploadFile(files[0])
            data.profileImages = url
        }

        if (Object.keys(rest).length > 0) {
            return res.status(400).send({ status: false, message: "Field Doesn't Exist" })
        }

        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please enter some DETAILS!!!" })
        }

        if (userId && !valid.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "UserId is Invalid" })
        }
        let userdata = await userModel.findOne({ _id: userId })

        if (!userdata) return res.status(404).send({ status: false, message: "No user found." })


        if (fname) {
            if (!valid.isValidString(fname)) return res.status(400).send({ status: false, message: "invalid fname details" });
            if (!valid.validName.test(fname)) return res.status(400).send({ status: false, message: "fname should be in proper format!!!" });
        }


        if (lname) {
            if (!valid.isValidString(lname)) return res.status(400).send({ status: false, message: "invalid lname details" });
            if (!valid.validName.test(lname)) return res.status(400).send({ status: false, message: "lname  should be in proper format!!!" });
        }


        if (email) {
            if (!valid.isValidString(email)) return res.status(400).send({ status: false, message: "invalid email details" });
            if (!valid.validEmail.test(email)) return res.status(400).send({ status: false, message: "email  should be in proper format!!!" });
            let uniqueEmail = await userModel.findOne({ email: email })
            if (uniqueEmail) return res.status(400).send({ status: false, message: "Email already exist" })
        }


        if (phone) {
            if (!valid.isValidString(phone)) return res.status(400).send({ status: false, message: "invalid phone details" });
            if (!valid.validPhone.test(phone)) return res.status(400).send({
                status: false,
                message: `${phone} should be in proper format!!!`
            });
            let uniquePhone = await userModel.findOne({ phone: phone })
            if (uniquePhone) return res.status(400).send({ status: false, message: "Phone Number already exist" })
        }


        if (password) {
            if (!valid.isValidString(password)) return res.status(400).send({ status: false, message: "Invalid password details" });
            if (!valid.validPassword.test(password)) return res.status(400).send({
                status: false,
                message: `${password} should be in proper format!!!`
            })
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)
            data.password = hash
        }


        let final = {}
        if (address) {
            if (Object.keys(address).length == 0) {
                return res.status(400).send({ status: true, message: "Address is mandatory." })
            }

            address = JSON.parse(address)

            if (address.shipping) {
                let { street, city, pincode } = address.shipping

                if (street !== undefined) {
                    if (!valid.isValidString(street)) {
                        return res.status(400).send({ status: true, message: "Street to update is not valid." })
                    }
                }
                console.log("Ok")
                console.log(address.shipping.street)
                console.log(final)
                let shipping = {}

                shipping = { $set: { street: street } }

                console.log(address1)
                if (city) {
                    if (!valid.isValidString(city)) {
                        return res.status(400).send({ status: true, message: "City to update is not valid." })
                    }
                }
                address1 = { $set: { "shipping.$.street": street } }
                if (pincode) {
                    if (!valid.isValidNumber(pincode)) {
                        return res.status(400).send({ status: true, message: "Pincode to update is not valid." })
                    }

                    if (!valid.validPincode.test(pincode)) return res.status(400).send({ status: false, message: "Pincode should be six digit only" })

                }
            }
            if (address.billing) {
                let { street, city, pincode } = address.billing
                if (street) {
                    if (!valid.isValidString(street)) {
                        return res.status(400).send({ status: true, message: "Street to update is not valid." })
                    }
                }
                if (city) {
                    if (!valid.isValidString(city)) {
                        return res.status(400).send({ status: true, message: "City to update is not valid." })
                    }
                }
                if (pincode) {
                    if (!valid.isValidNumber(pincode)) {
                        return res.status(400).send({ status: true, message: "Pincode to update is not valid." })
                    }

                    if (!valid.validPincode.test(pincode)) return res.status(400).send({ status: false, message: "Pincode should be six digit only" })

                }
            }
        }
        const updatedUser = await userModel.findOneAndUpdate({ userId: userId }, data, { new: true })

        return res.status(200).send({ status: true, message: "Successfully Updated", data: updatedUser })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}
module.exports.createUser = createUser
module.exports.loginUser = loginUser
module.exports.getUser = getUser
module.exports.updateUser = updateUser
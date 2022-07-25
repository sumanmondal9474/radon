const userModel = require('../models/userModel')
const valid = require('../middleware/validation')
const bcrypt = require('bcrypt')


const createUser = async function(req, res) {

    try {
        let final = {}

        final.profileImage = req.swap

        const { fname, lname, email, phone, password } = req.body

        if (valid.isValidBody(req.body)) {
            return res.status(400).send({ status: false, message: "Kindly enter all the required details." })
        }


        if (!valid.isValidString(fname)) {
            return res.status(400).send({ status: false, message: "fname not mentioned or not in correct format." })
        }
        if (valid.validName.test(fname)) {
            return res.status(400).send({ status: false, message: "fname not in correct format." })
        }
        final.fname = fname


        if (!valid.isValidString(lname)) {
            return res.status(400).send({ status: false, message: "lname not mentioned or not in correct format." })
        }
        if (valid.validName.test(lname)) {
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
            return res.status(400).send({ status: false, message: `${phone} is not valid (Try Indian Number)` })
        }
        const duplicatePhone = await userModel.findOne({ phone: phone })
        if (duplicatePhone) {
            return res.status(400).send({ status: false, message: `${phone} already registered.` })
        }
        final.phone = phone


        if (!valid.isValidString(password)) {
            return res.status(400).send({ status: false, message: "Password not mentioned or not in correct format" })
        }
        // if (!valid.validPassword.test(password)) {
        //     return res.status(400).send({ status: false, message: `The ${password} is not Strong (Length between 8-15)` })
        // }
        const salt = await bcrypt.genSalt(4)
        const hash = await bcrypt.hash(password, salt)
        final.password = hash
            // console.log("1st", final)
            // bcrypt.genSalt(saltRounds, function(saltError, salt) {
            //         if (saltError) {
            //             throw saltError
            //         } else {
            //             bcrypt.hash(password, salt, function(hashError, hash) {
            //                 if (hashError) {
            //                     throw hashError
            //                 } else {
            //                     console.log("Password", hash)
            //                     final["password"] = hash
            //                 }
            //             })
            //         }
            //     })
            //  final.password = password

        if (Object.keys(req.body.address).length == 0) {
            return res.status(400).send({ status: true, message: "Address is mandatory." })
        }

        let address = JSON.parse(req.body.address)
        if (typeof address !== 'object') {
            return res.status(400).send({ status: true, message: "Address is Invalid." })
        }

        if (Object.keys(address.shipping).length == 0) {
            return res.status(400).send({ status: true, message: "Shipping Address is mandatory." })
        }
        if (Object.keys(address.billing).length == 0) {
            return res.status(400).send({ status: true, message: "Billing Address is mandatory." })
        }

        const checkAddress = function(value) {

            if (valid.isValidBody(value)) {
                return res.status(400).send({ status: false, message: `OPPS!!You Forot to enter ${value} Address.` })
            }


            const { street, city, pincode } = value

            if (!valid.isValidString(street)) {
                return res.status(400).send({ status: false, message: `${value} Address Street is not mentiond or not valid.` })
            }
            if (!valid.isValidString(city)) {
                return res.status(400).send({ status: false, message: `${value} Address City is not mentiond or not valid.` })
            }
            if (!valid.isValidNumber(pincode)) {
                return res.status(400).send({ status: false, message: `${value} Address Pincode is not mentiond or not valid.` })
            }
            if (!pincode) {
                return res.status(400).send({ status: false, message: `${value} Address Pincode is not valid. ` })
            }

            return true
        }
        checkAddress(address.shipping)
        checkAddress(address.billing)
        final.address = address

        console.log(final)

        const createUser = await userModel.create(final)
        return res.status(201).send({ status: true, message: "User created successfully", data: createUser })

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


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
        const passwordEnteredByUser = req.body.password
        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
            if (err) return next(err);
            bcrypt.hash(passwordEnteredByUser, salt, function(err, hash) {
                if (err) return next(err);
                passwordEnteredByUser = hash;
            });
        })

        let user = await userModel.findOne({ email: email, password: passwordEnteredByUser });
        if (!user) {
            return res.status(401).send({ status: false, message: " your credentials are invalid" })
        }
        userId = user._id
        let token = jwt.sign({
                userId: user._id.toString(),
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + 50 * 60 * 60,
                batch: "radon",
                organisation: "functionUp"
            },
            "MeNeSunRa-radon"
        )

        //res.setHeader("x-api-key", token)
        return res.status(200).send({ status: true, message: "You are successfully loggedin", data: { userId, token } })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


module.exports.createUser = createUser
module.exports.loginUser = loginUser
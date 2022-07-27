const express = require('express')
const router = express.Router()
const { createUser, loginUser, getUser, updateUser } = require('../controllers/userController')
const { awsGenerator } = require('../controllers/awsController')
const { authentication, authorization } = require('../middleware/auth')

router.post('/register', createUser)
router.post('/login', loginUser)
router.get('/user/:userId/profile', authentication, authorization, getUser)
router.put('/user/:userId/profile', authentication, authorization, updateUser)
    //router.get('/auth/:userId', authentication, authorization)
router.all("/**", function(req, res) {
    res.status(404).send({
        status: false,
        message: "The api you request is not available"
    })
})

module.exports = router
const express = require('express')
const router = express.Router()
const { createUser, loginUser, getUser, updateUser } = require('../controllers/userController')
const { awsGenerator } = require('../controllers/awsController')

router.post('/register', awsGenerator, createUser)
router.post('/login', loginUser)
router.get('/user/:userId/profile', getUser)
router.put('/user/:userId/profile', updateUser)

router.all("/**", function(req, res) {
    res.status(404).send({
        status: false,
        message: "The api you request is not available"
    })
})

module.exports = router
const express = require('express');
const router = express.Router();
const userController= require("../controllers/userController")
const mid = require('../middleware/auth.js')

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/users", userController.createUser)

router.post("/login", userController.loginUser)

//The userId is sent by front end
router.get("/users/:userId",mid.userIdCheck,mid.authenticate,mid.authorise, userController.getUserData)
router.post("/users/:userId/posts",mid.userIdCheck,mid.authenticate,mid.authorise, userController.postMessage)

router.put("/users/:userId",mid.userIdCheck,mid.authenticate ,mid.authorise,userController.updateUser)
router.delete('/users/:userId',mid.userIdCheck,mid.authenticate ,mid.authorise,userController.deleteUser)

module.exports = router;
const express = require('express');
const router = express.Router();
const mid1 = require("../controllers/midleware")
const user = require("../controllers/userController")
const productController= require("../controllers/productController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post("/createProduct", productController.createProduct  )
router.post("/createuser",mid1.mid1, user.createUser  )

// router.get("/getBooksbyChetanBhagat", BookController.getBooksbyChetanBhagat)

// router.post("/createBooks", BookController.createBooks  )

// router.get("/authorOfBook", BookController.authorOfBook)

// router.post("/updateBooks", BookController.updateBooks)

// router.post("/deleteBooks", BookController.deleteBooks)

//MOMENT JS
// const moment = require('moment');
// router.get("/dateManipulations", function (req, res) {
    
//     // const today = moment();
//     // let x= today.add(10, "days")

//     // let validOrNot= moment("29-02-1991", "DD-MM-YYYY").isValid()
//     // console.log(validOrNot)
    
//     const dateA = moment('01-01-1900', 'DD-MM-YYYY');
//     const dateB = moment('01-01-2000', 'DD-MM-YYYY');

//     let x= dateB.diff(dateA, "days")
//     console.log(x)

//     res.send({ msg: "all good"})
// })

module.exports = router;
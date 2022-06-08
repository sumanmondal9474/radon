const express = require('express');
const router = express.Router();


const BookController = require("../controllers/bookController")

router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})


router.post("/createBook", BookController.createBook)

router.get("/allBooksList", BookController.allBooksList)

router.get("/yearDetails", BookController.yearDetails)

router.get("/particularBooks", BookController.particularBooks)

router.get("/priceDetails", BookController.priceDetails)

router.get("/randomBooks", BookController.randomBooks)

module.exports = router;
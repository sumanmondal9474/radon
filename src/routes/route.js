const express = require('express');
const app = express();

 const underscore = require('underscore')

const lodash = require('lodash');
const { append } = require('express/lib/response');
const router = express.Router();

//Create an array of strings containing the names all the months of a year and split the array into 4 equally sized sub-arrays using the chunk function. Print these sub-arrays
router.get('/hello', function (req, res) {
    res.send("hello, I am Suman ")
    const arr = ["Jan","Feb","Mar","Aprl","may","Jun","July","August","Sep","Oct","Nov","Dec"]
    let subarray = lodash.chunk(arr,4);
    console.log(subarray);
});


//Create an array containing the first 10 odd numbers. Using the tail function, return the last 9 elements of it and print them on console.
router.get('/hello2', function (req, res) {
    res.send(" hello2, I am Suman Mondal ")
    const arr1 = [1,3,5,7,9,11,13,15,16,17]
    let newArray = lodash.tail(arr1)
    console.log(newArray);
  
});


//Create 5 arrays of numbers containing a few duplicate values. Using the function union create a merged array with only unique values and print them
router.get("/hello3",function(req,res){
    res.send("I am Suman Mondal. ")
    let unionArr = underscore.union([2,5,7,3,3], [10,12,12,45,45],[2,5,8,7,7,8],[2,5,9,12,12],[14,15,15,28,16]);
console.log(unionArr);
})


//Use the function fromPairs to create an object containing key value pairs. For example [“horror”,”The Shining"],[“drama”,”Titanic"],[“thriller”,”Shutter Island"],[“fantasy”,”Pans Labyrinth"]
router.get("/hello4",function(req,res){
    res.send("hello4, I am Suman Mondal.. ")
var list = [["horror","The shining"],["deama","Titanic"],["thriller","Shutter Island"],["fantasy","Pans Labyrinth"]];
var result = lodash.fromPairs(list)

console.log(result);
});





//Assignment 2 : ------------>>
//Create an API for GET /movies that returns a list of movies. Define an array of movies in your code and return the value in response.
const movies = ["Rang de basanti", "The shining", "Lord of the rings", "Batman begins"]
router.get("/movies",function(req,res){
    return res.send({movies :movies})
});


//Create an API GET /movies/:indexNumber (For example GET /movies/1 is a valid request and it should return the movie in your array at index 1). You can define an array of movies again in your api

let myMovies =movies.at(1)
router.get("/movies/1",function(req,res){
    return res.send({movies1:myMovies})
});

// app.get("/sol1", function (req, res) {

//     let arr = [1,2,3,5,6,7]
//     let total = 0;
//     for(let i in arr){
//         total += arr[i];
//     }
//     let lastDigit = arr.pop()
//     let consecutiveSum = lastDigit*(lastDigit + 1)/2
//     let missignNumber = consecutiveSum - total
//     res.send({data:missignNumber});
// });

// router.get('/test-me', function (req, res) {
//     myHelper.printDate()
//     myHelper.getCurrentMonth()
//     myHelper.getCohortData()
//     let firstElement = underscore.first(['Sabiha','Akash','Pritesh'])
//     console.log('The first element received from underscope function is '+firstElement)
//     res.send('My first ever api!')
// });

// router.get('/hello', function (req, res) {
   
//     res.send('Hello there!')
// });

// router.get('/candidates', function(req, res){
//     console.log('Query paramters for this request are '+JSON.stringify(req.query))
//     let gender = req.query.gender
//     let state = req.query.state
//     let district = req.query.district
//     console.log('State is '+state)
//     console.log('Gender is '+gender)
//     console.log('District is '+district)
//     let candidates = ['Akash','Suman']
//     res.send(candidates)
// })

// router.get('/candidates/:canidatesName', function(req, res){
//     console.log('The request objects is '+ JSON.stringify(req.params))
//     console.log('Candidates name is '+req.params.canidatesName)
//     res.send('Done')
// })


module.exports = router;
const jwt = require('jsonwebtoken');


const authenticate = function(req, res, next) {
    let token = req.headers["x-Auth-token"];
  if (!token) token = req.headers["x-auth-token"];

  //If no token is present in the request header return error
  if (!token) return res.send({ status: false, msg: "token must be present" });

  console.log(token);
  
  // If a token is present then decode the token with verify function
  // verify takes two inputs:
  // Input 1 is the token to be decoded
  // Input 2 is the same secret with which the token was generated
  // Check the value of the decoded token yourself
  let decodedToken = jwt.verify(token, "functionup-thorium");
  if (!decodedToken)
    return res.send({ status: false, msg: "token is invalid" });
    //check the token in request header
    //validate this token
    

    next()
}


const authorise = function(req, res, next) {
    let token = req.headers["x-Auth-token"];
    let objectId= req.params.userId
    if (!token) token = req.headers["x-auth-token"];
  let decodedToken = jwt.verify(token, "functionup-thorium");
if(objectId==decodedToken.userId)

    // comapre the logged in user's id and the id in request
    next()
    else res.send({msg: "authorsition failed"})
}

module.exports.authorise=authorise
module.exports.authenticate=authenticate


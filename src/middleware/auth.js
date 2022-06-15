const jwt = require("jsonwebtoken");
const mid= function(req,res, next) {

    

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
    let decodedToken = jwt.verify(token, "functionup-radon");
    if (!decodedToken)
    return res.send({ status: false, msg: "token is invalid" });
    next();
    
}

module.exports.xy=mid
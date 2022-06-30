const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");


let createCollege = async function (req, res) {
    try{
        // function validURL(myURL) {
        //     var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        //     '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
        //     '((\\d{1,3}\\.){3}\\d{1,3}))'+ // ip (v4) address
        //     '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ //port
        //     '(\\?[;&amp;a-z\\d%_.~+=-]*)?'+ // query string
        //     '(\\#[-a-z\\d_]*)?$','i');
        //     return pattern.test(myURL);
        //   }
    let bodyData = req.body
    let { name, fullName, logoLink } = bodyData

    let checkname = await collegeModel.findOne({name:name})
    if (Object.keys(bodyData).length === 0) {
        return res.status(400).send({ status: false, msg: "please provide data" })
    }
if(!name){
    return res.status(400).send({ status: false, msg: "college name is missing" })
}
if(!/^([a-zA-z]){1,100}$/.test(name)){
    return res.status(400).send({ status: false, msg: "college name should not be a number or symbol" })
}
if(checkname){
    return res.status(400).send({ status: false, msg: "college name is alredy exist please enter unique college name" }) 
}
if(!fullName){
    return res.status(400).send({ status: false, msg: "college fullName is missing" })
}
if(!logoLink){
    return res.status(400).send({ status: false, msg: "college logoLink is missing" })
}
// let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/g;
// if (!logoLink.match(regex)) return res.status(400).send({ status: false, message: "Please enter valid LogoLink" })
// if(!mongoose.stringIsAValidUrl(logoLink)) {return res.status(400).send({ status: false, message: "Please enter valid LogoLink" })}
// if (!validUrl.isUri(logoLink)){return res.status(400).send({ status: false, message: "Please enter valid LogoLink" })}
// if(!(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%.\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%\+.~#?&//=]*)/g).test(logoLink)){
//     return res.status(400).send({ status: false, msg: "please enter a valid logoLink" })
// }
// if(!validURL(logoLink)){return res.status(400).send({ status: false, message: "Please enter valid LogoLink" })}
// if(!(/(https?:\/\/.*\.(?:jpg|jpeg|png|gif))/i).test(logoLink)){
//   { return res.status(400).send({ status: false, msg: "please enter a valid logoLink" })}}
const logoLinkValidator = (/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g).test(logoLink)
            if (!logoLinkValidator) {
                return res.status(400).send({ status: false, message: "Please enter a valid logo link " })
            }

let collegecreate = await collegeModel.create(bodyData)

    res.status(201).send({ status: true, data:collegecreate})
}
catch(error){
    res.status(500).send({status:false,msg:error.message})
}
}


const collegedetail = async function (req, res) {

try{let data1 = req.query.name
if(!data1){
    return res.status(400).send({status:false,msg:"please provide college name"})
}
let checkname = await collegeModel.find({name:data1})
if(checkname.length==0){
    return res.status(400).send({status:false,msg:"please provide valid college name"})
}
let college = await collegeModel.findOne({name:data1 , isDeleted:false},{updatedAt:0,createdAt:0,isDeleted:0,__v:0}).lean()
let collegeId=college._id
let interns=await internModel.find({collegeId:collegeId},{_id:1,updatedAt:0,createdAt:0,isDeleted:0,__v:0,collegeId:0}).lean()
college.interns=interns

delete college._id
res.status(200).send({data:college}) }
catch(error){
    res.status(500).send({status:false,msg:error.message})
}

}

module.exports.createCollege = createCollege
module.exports.collegedetail = collegedetail

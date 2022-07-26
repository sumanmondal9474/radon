const aws = require("aws-sdk")

aws.config.update({
    accessKeyId: "AKIAY3L35MCRVFM24Q7U",
    secretAccessKey: "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",
    region: "ap-south-1"
})

let uploadFile = async(file) => {
    return new Promise(function(resolve, reject) {
        // this function will upload file to aws and return the link
        let s3 = new aws.S3({ apiVersion: '2006-03-01' }); // we will be using the s3 service of aws

        var uploadParams = {
            ACL: "public-read",
            Bucket: "classroom-training-bucket", //HERE
            Key: "abc/" + file.originalname, //HERE 
            Body: file.buffer
        }


        s3.upload(uploadParams, function(err, data) {
            if (err) {
                return reject({ "error": err })
            }
            console.log("File uploaded succesfully")
            return resolve(data.Location)
        })

    })
}


const awsGenerator = async function(req, res, next) {

    try {
        let files = req.files
        if (files && files.length > 0) {

            let uploadedFileURL = await uploadFile(files[0])
                // res.status(201).send({msg: "file uploaded succesfully", data: uploadedFileURL})
            req.swap = uploadedFileURL
            next()
        } else {
            res.status(400).send({ status: false, message: "No file found" })
            next()
        }

    } catch (err) {
        res.status(500).send({ msg: err })
    }

}

module.exports.uploadFile = uploadFile
module.exports.awsGenerator = awsGenerator
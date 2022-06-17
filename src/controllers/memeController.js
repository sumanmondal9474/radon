let axios = require('axios')

let getMeme = async function (req, res) {
    try {
        let a= req.query.template_id
        let b = req.query.text0
        let c=req.query.text1
        let d=req.query.username
        let e=req.query.password
        let options = {
            method: "post",
            url: `https://api.imgflip.com/caption_image?template_id=${a}&text0=${b}&text1=${c}&username=${d}&password=${e}`
        }

        let result = await axios(options);
        console.log(result)
        let data2 = result.data
        // let temp1 = data2.main.temp
        res.status(200).send({ msg: data2, status: true })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ msg: err.message })
    }
}

module.exports.getMeme=getMeme
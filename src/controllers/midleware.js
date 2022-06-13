const mid1 = function(req,res,next) {
    let data2 = req.headers.isFreeAppUser 
    if(!data2) {return res.send('msg: header is missing')}
    else {next()}
}
module.exports.mid1= mid1
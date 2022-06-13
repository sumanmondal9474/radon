const productModel =  require('../models/productModel');

const createProduct = async function(req, res){
    let data= req.body
    let productCreate= await productModel.create(data)
    res.send(productCreate)
}
module.exports.createProduct = createProduct
const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema( {
    author_name: String,
    rating:Number

}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema)

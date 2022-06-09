const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema( {
    publisher_name: String,
    headQuarter:String

}, { timestamps: true });

module.exports = mongoose.model('publisher', publisherSchema)
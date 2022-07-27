const mongoose = require('mongoose')


exports.isValidString = function(value) { //function to check entered data is valid or not
    if (typeof value == 'undefined' || value == null) return false;
    if (typeof value == 'string' && value.trim().length === 0) return false;
    return true;
}

exports.isValidBoolean = function(value) { //function to check entered data is valid or not
    if (typeof value == 'undefined' || value == null) return false;
    if (typeof value == 'boolean') return false;
    return true;
}

exports.isValidNumber = function(value) { //function to check entered data is valid or not
    if (typeof value == 'undefined' || value == null) return false;
    if (typeof value == 'number')
        return true;
}

exports.isValidBody = function(value) {
    if (Object.keys(value).length == 0) return true
}

exports.isValidObjectId = function(value) {
    return mongoose.Types.ObjectId.isValid(value)
}

exports.validName = /^[a-zA-Z ]{3,15}$/

exports.validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

exports.validPhone = /^[6-9]{1}[0-9]{9}$/

exports.validPassword = /^[a-zA-Z0-9]{8,15}$/

exports.validPincode = /^[0-9]{6}$/

exports.validPrice = /^[0-9]{0-10}[.0-9]{2}$/
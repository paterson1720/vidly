const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    phone: {
        type: String,
        required: true,
        maxlength: 50
    },
    isGold: {
        type: Boolean,
        default: false
    }
})); 

//Helper Functions
function validateCustomer(customer){
    const schema = {
        name: Joi.string().min(3).required(),
        phone: Joi.number().required(),
        isGold: Joi.boolean()
    }
    return Joi.validate(customer, schema);
}

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
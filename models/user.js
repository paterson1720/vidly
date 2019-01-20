const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        trim: true
    },

    email: {
        type: String,
        required: true,
        maxlength: 255,
        unique: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        maxlength: 1024
    }
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_d: this._id}, config.get('jwtPrivateKey'));
}
const User = mongoose.model('User', userSchema);

function validateUser(user){
    const schema = {
        name: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().max(255).required()
    }
    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
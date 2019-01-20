const mongoose = require('mongoose');

const Schema =  mongoose.Schema;

const Rental = mongoose.model('Rental', new Schema({
    customer: { 
        type : new Schema({
            name: {
                type: String,
                required: true,
                maxlength: 50,
                minlength: 5
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true
            }
        }), 
        required: true
    },

    movie: {
        type: new Schema({
            title: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },

    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },

    dateReturned: Date,
    
    rentalFee: {
        type: Number,
        min: 0
    }   
}));


function validateRental(rental){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;
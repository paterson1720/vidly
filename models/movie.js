const mongoose = require('mongoose');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 255,
        required: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock:  {
        type: Number,
        min: 0,
        max: 255,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        required: true
    }
}));


function validateMovie(movie) {
    const schema = {
      title: Joi.string().min(5).required(),
      genreId: Joi.objectId().required(),
      numberInStock: Joi.number().min(0).required(),
      dailyRentalRate: Joi.number().min(0).required()
    };
  
    return Joi.validate(movie, schema);
  }

  module.exports.Movie = Movie;
  module.exports.validateMovie = validateMovie;
const express = require('express');
const { Rental, validateRental } = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const mongoose = require('mongoose');
const Fawn = require('fawn');

const router = express.Router();
Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const rentals = await Rental.find();
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const {error} = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer
        .findById(req.body.customerId)
        .select('_id name phone');
    if(!customer) return res.status(404).send('Customer not found');

    const movie = await Movie
        .findById(req.body.movieId)
        .select('_id title numberInStock dailyRentalRate');
    if(!movie) return res.status(404).send('Movie not found');

    if(movie.numberInStock <= 0) return res.send("Movie not in stock");

    const rental = new Rental({
        customer: customer,
        movie: movie
    });

    /*
    When dealing with several operations like: 
        await movie.numberInStock --;
        await rental.save();
    we need to use trasactions with the help of the "Fawn" Library
    */
    try {
       new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id: movie._id}, {
                $inc: { numberInStock: -1 }
            })
            .run();

        res.send(rental);  
    }
    catch(ex) {
        res.status(500).send('Something failed');
    }
   
})

module.exports = router;
const { Movie , validateMovie } = require('../models/movie');
const express = require('express');
const mongoose = require('mongoose');
const { Genre } = require('../models/genre');
const router = express.Router();

router.get('/', async (req, res) =>{
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

router.post('/', async (req, res) =>{

    const {error} = validateMovie(req.body);
    if(error) return res.status(404).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId).select('_id name');
    console.log(genre);
    if (!genre) return res.status(404).send('Invalid Genre');

    let movie = new Movie({
        title: req.body.title,
        genre: genre,
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    await movie.save(); 
    res.send(movie);
});

router.put('/:id', async (req, res) =>{
    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            genreId: req.body.genreId,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    });
    res.send(movie);
});

router.get('/:id', async (req, res) =>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.send('Invalid ID');

    const movie = await Movie.findById(req.params.id);
    res.send(movie);
});
module.exports = router;
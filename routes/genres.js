const express = require('express');
const { Genre, validateGenre } = require('../models/genre');
const router = express.Router();

  router.get('/', async (req, res) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
  });
  
  router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({
        name: req.body.name
    });
  
    await genre.save();
    res.send(genre);
  });
  
  router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const id = req.params.id;
    const genre = await Genre.findByIdAndUpdate(id, {
        name: req.body.name
    }, { new: true });

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    res.send(genre);
  });
  
  router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const genre = await Genre.findByIdAndRemove(id);

    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
  });
  
  router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const genre = await Genre.findById(id);
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');

    res.send(genre);
  });
  
  module.exports = router;
  


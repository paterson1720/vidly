const Joi = require('Joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const users = require('./routes/users');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const auth = require('./routes/auth');
const rentals = require('./routes/rentals');
const app = express();

const configuration = config.get('jwtPrivateKey');
if (!configuration) {
  console.error('FATAL ERROR: jwt is undefined');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/vidly')
.then(() =>console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to the database', err));

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

//Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
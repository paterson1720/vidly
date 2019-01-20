const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {User, validateUser} = require('../models/user');
const router = express.Router();

router.get('/', async (req, res) =>{
    const users = await User.find();
    res.send(users);
});

router.post('/', async (req, res) => {

    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('User already registered');

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    //using bcrypt to hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    user.password = hashedPassword;

    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
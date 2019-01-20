const express = require('express');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const {User} = require('../models/user');
const router = express.Router();

router.post('/', async (req, res) => {

    const {error} = validate(req.body);
    if(error) return req.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Invalid email or password');

    const hashedPassword = user.password;
    const validPassword = await bcrypt.compare(req.body.password, hashedPassword );

    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();

    res.send(token);
})

function validate(user){
    const schema = {
        email: Joi.string().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(user, schema);
}
module.exports = router;
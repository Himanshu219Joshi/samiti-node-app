'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const user = require('../models/user');
const { signIn } = require('../controllers/authController');
const SECRET_KEY = "testSamitiApp"

// post request for user registration

router.post("/register", async (req, res, next) => {
    let user = new User(req.body)
    console.log(req.body.password);
    user.hash_password = bcrypt.hashSync(req.body.password, 10);
    const savedUser = await user.save().then(user => user)
    res.status(200).json(savedUser)
    next()
})
// post request for user log in  
router.post("/signIn", async (req, res, next) => {
    const response = await signIn(req)
    res.status(response.status).json(response);
    next()
})

module.exports = router;
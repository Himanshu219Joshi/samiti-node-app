'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { signIn } = require('../controllers/authController');
const SECRET_KEY = "testSamitiApp"
const jwt = require('jsonwebtoken');
// post request for user registration


router.post('/login', async (req, res) => {
    console.log(req.body);
    const { mobileNumber } = req.body;
    
  
    const user = await User.findOne({mobileNumber: mobileNumber}).then(user => user);
  
    if (!user) {
      return res.status(400).send('Mobile or Password is incorrect');
    }
  
    console.log(user);
    const token = jwt.sign({ mobileNumber: user.mobileNumber }, SECRET_KEY, { expiresIn: '15m' });
    res.json({ token, userInfo: user });
  });

router.post("/register", async (req, res, next) => {
    let user = new User(req.body)
    console.log(req.body);
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
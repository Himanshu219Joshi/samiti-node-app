'use strict';

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const SECRET_KEY = "testSamitiApp"

// post request for user registration

router.post("/register", (req, res, next) => {
    let { mobileNo, password } = req.body;
    const hash_password = bcrypt.hashSync(password, 10);
    // newUser.save((err, user) => {
    //     if (err) {
    //         res.status(500).send({ message: err });
    //     }
    //     user.hash_password = undefined;
    //     res.status(201).json(user);
    // });
    res.status(200).json({mobile_no: mobileNo, hash_key: hash_password})
    next()
})
// post request for user log in  
router.post("/signIn", (req, res, next) => {
    console.log(req.body)
    User.findOne({
        mobileNo: req.body.mobileNo
    }, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(401).json({ message: 'Authentication failed. User not found.' });
        } else if (user) {
            if (!user.comparePassword(req.body.password)) {
                res.status(401).json({ message: 'Authentication failed. Wrong password.' });
            } else {
                res.json({
                    token: jwt.sign({ mobile_no: req.body.mobileNo, },  SECRET_KEY , {expiresIn: '15m'})
                });
            }
        }
    });
    next()
})

module.exports = router;
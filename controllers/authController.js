
const User = require("../models/user");
const SECRET_KEY = "testSamitiApp"

module.exports = {
    // import jsonwebtoken
    // const jwt = require('jsonwebtoken');
    // const bcrypt = require('bcryptjs');


    // app.use((req, res, next) => {
    //     if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
    //         jwt.verify(req.headers.authorization.split(' ')[1], 'RESTfulAPIs', (err, decode) => {
    //             if (err) req.user = undefined;
    //             req.user = decode;
    //             next();
    //         });
    //     } else {
    //         req.user = undefined;
    //         next();
    //     }
    // });

    // import bcryptjs - hashing function 
    //DEFINE CONTROLLER FUNCTIONS

    // User Register function
    register: (req, res) => {
        let newUser = new User(req.body);
        newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
        newUser.save((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
            }
            user.hash_password = undefined;
            res.status(201).json(user);
        });
    },

    // User Sign function
    signIn: (req, res) => {
        User.findOne({
            email: req.body.email
        }, (err, user) => {
            if (err) throw err;
            if (!user) {
                res.status(401).json({ message: 'Authentication failed. User not found.' });
            } else if (user) {
                if (!user.comparePassword(req.body.password)) {
                    res.status(401).json({ message: 'Authentication failed. Wrong password.' });
                } else {
                    res.json({
                        token: jwt.sign({ email: user.email, fullName: user.fullName, _id: user._id }, 'RESTfulAPIs')
                    });
                }
            }
        });
    },

    // User Register function
    loginRequired : (req, res, next) => {
        if (req.user) {
            res.json({ message: 'Authorized User, Action Successful!' });
        } else {
            res.status(401).json({ message: 'Unauthorized user!' });
        }
    }
}

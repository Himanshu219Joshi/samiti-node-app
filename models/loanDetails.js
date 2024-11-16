'use strict';

// Import mongoose 
const mongoose = require("mongoose");

// Import bcryptjs - for password hashing
const bcrypt = require('bcryptjs');

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance for User and add properties
const LoanDetails = new Schema({
    memberId: {
        type: Number
    }, 
    memberName: {
        type: String
    },
    loanAmount: { 
        type: Number
    },
    createdOn: {
        type: Date,
        default: Date.now
    }
});


// Create and export User model
module.exports = mongoose.model("loans", LoanDetails);

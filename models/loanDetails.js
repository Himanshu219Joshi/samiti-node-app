'use strict';

// Import mongoose 
const mongoose = require("mongoose");

// Import bcryptjs - for password hashing
const bcrypt = require('bcryptjs');

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance for User and add properties
const LoanDetails = new Schema({
    loanAmount: { 
        type: Number
    },
    createdOn: {
        type: String,
    },
    date: {
        type: String
    },
    emiAmount: {
        type: Number
    },
    finalAmoutWithInterest: {
        type: Number
    },
    totalInterest: {
        type: Number
    },
    loanAmountRecovered: {
        type: Number
    },
    interestAccrued: {
        type: Number
    },
    guarantors: {
        type: Array
    },
    loanStatus: {
        type: String
    },
    memberDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'member'
    },
});


// Create and export User model
module.exports = mongoose.model("loans", LoanDetails);

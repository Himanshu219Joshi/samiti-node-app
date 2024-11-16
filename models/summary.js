'use strict';

// Import mongoose 
const mongoose = require("mongoose");

// Import bcryptjs - for password hashing
const bcrypt = require('bcryptjs');

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

const samitiSummarySchema = new Schema({
    totalAmount: {
        type: Number
    },
    lentAmount: {
        type: Number
    }, 
    balanceAmount: {
        type: Number
    }, 
    interest:{
        date: Date
    }
})  

const lastLoanSummarySchema = new Schema({
    memberId: {
        type: Number
    },
    memberName: {
        type: String
    }, 
    balanceAmount: {
        loanAmount: String
    }, 
    interest:{
        type: Number
    }
})  

// Create Schema Instance for User and add properties
const SamitiSummary = new Schema({
    summary: {
        type: samitiSummarySchema        
    },
    lastLoan: {
        type: lastLoanSummarySchema
    }
});

// SamitiSummary.methods.comparePassword = function (password) {
//     return bcrypt.compareSync(password, this.hash_password);
// }

// Create and export User model
module.exports = mongoose.model("summary", SamitiSummary);

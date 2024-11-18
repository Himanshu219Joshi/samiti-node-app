'use strict';

// Import mongoose 
const mongoose = require("mongoose");

// Import bcryptjs - for password hashing
const bcrypt = require('bcryptjs');

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

const SamitiSummarySchema = new Schema({
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

const LastLoanSummarySchema = new Schema({
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
    },
    date: {
        type: String
    },
    loanAmount: {
        type: Number
    }
})  

// Create Schema Instance for User and add properties
const SamitiSummary = new Schema({
    summary: {
        type: SamitiSummarySchema        
    },
    lastLoan: {
        type: LastLoanSummarySchema
    }
});

// SamitiSummary.methods.comparePassword = function (password) {
//     return bcrypt.compareSync(password, this.hash_password);
// }

// Create and export User model
module.exports = {
    summary: mongoose.model("summary", SamitiSummary),
    samitiSummary: SamitiSummarySchema,
    lastLoanSummary:LastLoanSummarySchema
}

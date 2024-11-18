'use strict';

// Import mongoose 
const mongoose = require("mongoose");

// Import bcryptjs - for password hashing
const bcrypt = require('bcryptjs');

// Declare schema and assign Schema class
const Schema = mongoose.Schema;

// Create Schema Instance for User and add properties
const MemberSchema = new Schema({
    memberId: {
        type: Number
    }, 
    memberName: { 
        type: String 
    }, 
    fatherName: {
        type: String
    }, 
    loanAmount: {
        type: Number 
    },
    investedMoney:{
        type: Number
    }
});


// Create and export User model
module.exports = mongoose.model("member", MemberSchema);

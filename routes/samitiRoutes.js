const express = require('express');
const samitiData = require('../controllers/samitiController');
const router = express.Router();


// Define a route
router.get('/memberList', (req, res) => {
    res.json(samitiData.getMembers());// this gets executed when user visit http://localhost:3000/user
});

router.get('/getSummary', (req, res) => {
    res.json(samitiData.getSamitiSummary());// this gets executed when user visit http://localhost:3000/user/101
});

router.get('/loanDetails', (req, res) => {
    res.json(samitiData.getLoanList());// this gets executed when user visit http://localhost:3000/user/102
});

// export the router module so that server.js file can use it
module.exports = router;
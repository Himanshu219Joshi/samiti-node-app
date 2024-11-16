const express = require('express');
const samitiData = require('../controllers/samitiController');
const router = express.Router();


// Define a route
router.get('/memberList', async (req, res, next) => {
    const response = await samitiData.getMembers()
    res.json(response);// this gets executed when user visit http://localhost:3000/user
    next()
});

router.get('/getSummary', async (req, res, next) => {
    const response = await samitiData.getSamitiSummary(req)
    res.status(200).json(response);
    next()
});

router.get('/loanDetails', async (req, res, next) => {
    const response = await samitiData.getLoanList()
    console.log("Loan Details", response)
    res.json(response);// this gets executed when user visit http://localhost:3000/user/102
    next()
});

// export the router module so that server.js file can use it
module.exports = router;
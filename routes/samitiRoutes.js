const express = require('express');
const samitiData = require('../controllers/samitiController');
const router = express.Router();


// Define a route
router.get('/getMembers', async (req, res, next) => {
    const response = await samitiData.getMembers()
    res.json(response);
    next()
});

router.get('/getSummary', async (req, res, next) => {
    const response = await samitiData.getSamitiSummary(req)
    res.status(200).json(response);
    next()
});

router.get('/getLoans', async (req, res, next) => {
    const response = await samitiData.getLoanList()
    res.json(response);
    next()
});

router.post('/updateSummary', async (req, res, next) => {
    const response = await samitiData.updateSummary(req)
    res.json(response);
    next()
});

router.get('/generatePdf', (req, res, next) => {
    const response = samitiData.generatePdf(req, res, next);
    const options = { headers: { 'Content-Type': 'application/pdf' } };

})

router.post('/settleLoan/:memberId', async (req, res, next) => {
    const response = samitiData.settelLoan(req, res, next);
    res.json({message: "Loan Settled"});
    next()
})

router.get('/getLoans/:loanId', async (req, res, next) => {
    const response = await samitiData.getLoan(req, res, next);
    res.json(response);
})

router.get('/addNewFieldInRecords', async (req, res, next) => {
    const response = await samitiData.addNewFieldInRecords(req, res, next);
    res.json(response);
})

router.get("/gurantors", async(req, res, next) => {
    const response = await samitiData.getGurnatorList(req, res, next);
    res.json(response);
})

// export the router module so that server.js file can use it
module.exports = router;
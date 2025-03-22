const express = require('express');
const schedulerController = require('../controllers/schedulerController');
const router = express.Router();


router.get('/triggerMontlyTask', (req, res, next) =>{
    schedulerController.getMonthlyTaskDone(req, res)
    next()
})

module.exports = router;
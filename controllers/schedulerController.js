const crone = require('node-cron')
const MemberDetails = require('../models/memberDetails');
const { monthDiff } = require('../utils');
const { $nor } = require('sift');
const { response } = require('express');


const monthlyTask = async (req, res) => {
    console.log("Executing Montly Task")
    const numberOfMonth = monthDiff(new Date('06-15-2024'), new Date()) + 1;
    const memberDetails = await MemberDetails.updateMany({ $nor: [{ memberId: 21 }, { memberId: 22 }] }, { investedMoney: numberOfMonth * 600 })
    
    res.send("Updated All Record Successfully")
}

crone.schedule('0 0 15 * *', () => {
    monthlyTask
})

module.exports = {
    getMonthlyTaskDone: (req, res) => {
        console.log("Executing Montly Task")
        const numberOfMonth = monthDiff(new Date('07-15-2024'), new Date()) + 1;
        const updateMemberDetails = MemberDetails.updateMany({ $nor: [{ memberId: 21 }, { memberId: 22 }] }, {investedMoney: numberOfMonth * 500}, 
            ).then((response, err)=>{
                console.log(response)
            });
        res.send("Updated All Record Successfully")
    }
}
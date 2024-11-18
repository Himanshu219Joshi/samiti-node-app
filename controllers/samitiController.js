const { memberList, samitiSummary, loanDeatils } = require("../mock");
const LoanDetails = require("../models/loanDetails");
const MemberDetails = require("../models/memberDetails");
const SummarySchema = require("../models/summary").summary;
const { getMonthName } = require('../utils');


module.exports = {
    getMembers: async (req, res, next) => {
        const response = await MemberDetails.find({})
        return response;
    }, 

    getLoanList: async (req, res, next) => {
        const loanDeatils = await LoanDetails.find({})
        return loanDeatils;
    },

    getSamitiSummary: async (req, res, next) => {
        const summary = await SummarySchema.findOne({});
        return summary;
    },

    updateSummary: async(req, res, next) => {
        console.log(req.body);
        const summaryInfo = await SummarySchema.findOne({});
        const memberDetails  = await MemberDetails.findOne({memberId: req.body.memberId})
        
        const { totalAmount = 0, lentAmount = 0 } = summaryInfo.summary
        const totalAmountValue = totalAmount + req.body.totalAmount; 
        const lentAmountValue = lentAmount + req.body.loanAmount;
        const balanceAmountValue = totalAmountValue - lentAmountValue;
        const dateObj = new Date()
        const dateFormated = `${dateObj.getDate()}-${getMonthName(dateObj.getMonth())}-${dateObj.getFullYear()}`

        const updateSummaryRequest = {
            totalAmount: totalAmountValue,
            balanceAmount: balanceAmountValue,
            lentAmount: lentAmountValue,
            date: dateFormated
        };

        const updateLastLoanRequest = {
            memberId: memberDetails.memberId,
            memberName: memberDetails.memberName,
            loanAmount: req.body.loanAmount,
            date: dateFormated
        }    

        const updatedSummary = await SummarySchema.updateOne({
            summary: updateSummaryRequest,
            lastLoan: updateLastLoanRequest
        })

        return updatedSummary;
    }
}
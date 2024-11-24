const { memberList, samitiSummary, loanDeatils } = require("../mock");
const LoanDetails = require("../models/loanDetails");
const MemberDetails = require("../models/memberDetails");
const SummarySchema = require("../models/summary").summary;
const { getMonthName, getEmiAmount } = require('../utils');


module.exports = {
    getMembers: async (req, res, next) => {
        const response = await MemberDetails.find({})
        response.sort((a, b) => a.memberId - b.memberId)
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
        // console.log("Body Request", req.body);
        const summaryInfo = await SummarySchema.findOne({});
        const memberDetails  = await MemberDetails.findOne({memberId: req.body.memberId})
        
        // console.log("Summary Info", summaryInfo);

        const { totalAmount = 0, lentAmount = 0, penaltyAmount = 0, balanceAmount } = summaryInfo.summary
        const penaltyAmountValue = penaltyAmount + (req.body.penaltyAmount || 0);
        const totalAmountValue = totalAmount + req.body.totalAmount + (req.body.penaltyAmount || 0);
        const lentAmountValue = lentAmount + req.body.loanAmount;
        const balanceAmountValue = totalAmountValue - lentAmountValue;
        const dateObj = new Date()
        const dateFormated = `${dateObj.getDate()}-${getMonthName(dateObj.getMonth())}-${dateObj.getFullYear()}`

        const updateSummaryRequest = {
            totalAmount: totalAmountValue,
            balanceAmount: balanceAmountValue,
            lentAmount: lentAmountValue,
            penaltyAmount: penaltyAmountValue,
            date: dateFormated
        };

        // console.log("Updated Summary", updateSummaryRequest)

        const updateLastLoanRequest = {
            memberId: memberDetails.memberId,
            memberName: memberDetails.memberName,
            loanAmount: req.body.loanAmount,
            date: dateFormated,
            emiAmount: getEmiAmount(req.body.loanAmount)
        }
        
        

        const updatedSummary = await SummarySchema.updateOne({
            summary: updateSummaryRequest,
            lastLoan: updateLastLoanRequest
        })


        const updateLoanDetails = await LoanDetails.create(updateLastLoanRequest)
        const updateMemberDetails = await MemberDetails.findOneAndUpdate({memberId: memberDetails.memberId}, {
            $set :{ 
                loanAmount: req.body.loanAmount
            }
        })


        // return updatedSummary;
    }
}
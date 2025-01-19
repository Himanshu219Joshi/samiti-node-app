const { ObjectId } = require("bson");
const LoanDetails = require("../models/loanDetails");
const MemberDetails = require("../models/memberDetails");
const SummarySchema = require("../models/summary").summary;
const { getMonthName, getEmiAmount, getFinalAmountWithInterestValue, getInterest, monthDiff } = require('../utils');
const memberDetails = require("../models/memberDetails");


module.exports = {
    getMembers: async (req, res, next) => {
        const response = await MemberDetails.find({}).populate('loanDetails') 
        response.sort((a, b) => a.memberId - b.memberId)
        return response;
    }, 

    getLoanList: async (req, res, next) => {
        const loanDeatils = await LoanDetails.find({}).populate('memberDetails')

        loanDeatils.forEach(element => {
            const numberOfMonth = monthDiff(new Date(element.date), new Date());
            
            const interest = Math.round(element.totalInterest/20);
            element.loanAmountRecovered = numberOfMonth * (element.emiAmount - interest);
           
            element.interestAccrued = interest * numberOfMonth;;
        })

           
        return loanDeatils;
    },

    getSamitiSummary: async (req, res, next) => {
        const summary = await SummarySchema.findOne({});
        return summary;
    },

    updateSummary: async(req, res, next) => {
        // console.log("Body Request", req.body);
        const summaryInfo = await SummarySchema.findOne({});
        const memberDetails  = await MemberDetails.findOne({memberId: req.body.memberId}).populate('loanDetails')
        const loanDetails = await LoanDetails.find({})

        loanDetails.forEach(element => {
            console.log(element)
            const numberOfMonth = monthDiff(new Date(element.date), new Date());
            
            const interest = Math.round(element.totalInterest/20);
            element.loanAmountRecovered = numberOfMonth * (element.emiAmount - interest);
           
            element.interestAccrued = interest * numberOfMonth;;
        })

        const interestAccrued = loanDetails.reduce((totalInterest, currentValue, currentIndex) => {
            totalInterest += currentValue.interestAccrued
            return totalInterest;
        }, 0)

        const loanAmountRecovered = loanDetails.reduce((totalAmountRecovered, currentValue, currentIndex) => {
            totalAmountRecovered += currentValue.loanAmountRecovered
            return totalAmountRecovered;
        }, 0)
        

        const { totalAmount = 0, lentAmount = 0, penaltyAmount = 0, balanceAmount } = summaryInfo.summary
        const penaltyAmountValue = penaltyAmount + (req.body.penaltyAmount || 0);
        const totalAmountValue = totalAmount + req.body.totalAmount + (req.body.penaltyAmount || 0);
        const lentAmountValue = lentAmount + req.body.loanAmount;
        const balanceAmountValue = totalAmountValue - lentAmountValue;
        const dateObj = new Date()
        const dateFormated = `${dateObj.getDate()}-${getMonthName(dateObj.getMonth())}-${dateObj.getFullYear()}`
        const tenure = req.body.tenure || 20
        const loanAmountValue = req.body.loanAmount

        const emiAmountValue = getEmiAmount(loanAmountValue);
        const finalAmountWithInterestValue = getFinalAmountWithInterestValue(emiAmountValue, tenure) 
        const totalInterestValue = getInterest(finalAmountWithInterestValue, loanAmountValue)

        const updateSummaryRequest = {
            totalAmount: totalAmountValue,
            balanceAmount: balanceAmountValue,
            lentAmount: lentAmountValue,
            penaltyAmount: penaltyAmountValue,
            date: dateFormated,
            interestAccrued: interestAccrued,
            loanAmountRecovered: loanAmountRecovered
        };

        // console.log("Updated Summary", updateSummaryRequest) 

        const updateLastLoanRequest = {
            memberId: memberDetails.memberId,
            memberName: memberDetails.memberName,
            loanAmount: loanAmountValue,
            date: dateFormated,
            emiAmount: emiAmountValue,
            finalAmoutWithInterest: finalAmountWithInterestValue,
            totalInterest: totalInterestValue
        }
        
        

        const updatedSummary = await SummarySchema.updateOne({
            summary: updateSummaryRequest,
            lastLoan: updateLastLoanRequest
        })


        const updateLoanDetails = await LoanDetails.create(updateLastLoanRequest)
        const updateMemberDetails = await MemberDetails.findOneAndUpdate({memberId: memberDetails.memberId, loanDetails: updateLoanDetails._id}, {
            $set :{ 
                loanAmount: req.body.loanAmount
            }
        })

        return updatedSummary;
    }
}
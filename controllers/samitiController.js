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
        const loanDetails = await LoanDetails.find({}).populate('memberDetails')

        loanDetails.forEach(element => {
            const numberOfMonth = monthDiff(new Date(element.date), new Date());
            
            const interest = Math.round(element.totalInterest/20);
            element.loanAmountRecovered = numberOfMonth * (element.emiAmount - interest);
           
            element.interestAccrued = interest * numberOfMonth;;
        })

        return loanDetails;
    },
    getSamitiSummary: async (req, res, next) => {
        const summary = await SummarySchema.findOne({}).populate({path: 'lastLoan', populate: {path: 'loanDetails'}});
        return summary;
    },

    updateSummary: async(req, res, next) => {
        // console.log("Body Request", req.body);
        const summaryInfo = await SummarySchema.findOne({});
        const memberDetails  = await MemberDetails.findOne({memberId: req.body.memberId}).populate('loanDetails')
        const loanDetails = await LoanDetails.find({})

        loanDetails.forEach(element => {
            const numberOfMonth = monthDiff(new Date(element.date), new Date());
            
            const interest = Math.round(element.totalInterest/20);
            element.loanAmountRecovered = numberOfMonth * (element.emiAmount - interest);
           
            element.interestAccrued = interest * numberOfMonth;;
        })
        
        console.log("Loan Details", loanDetails)

        const interestAccrued = loanDetails.reduce((totalInterest, currentValue, currentIndex) => {
            totalInterest += currentValue.interestAccrued
            return totalInterest;
        }, 0)

        const loanAmountRecovered = loanDetails.reduce((totalAmountRecovered, currentValue, currentIndex) => {
            totalAmountRecovered += currentValue.loanAmountRecovered
            return totalAmountRecovered;
        }, 0)
        
        console.log(req.body);

        const { totalAmount = 0, lentAmount = 0, penaltyAmount = 0, balanceAmount } = summaryInfo.summary
        const penaltyAmountValue = penaltyAmount + (req.body.penaltyAmount || 0);
        const totalAmountValue = totalAmount + (req.body.totalAmount || 0) + (req.body.penaltyAmount || 0);
        const lentAmountValue = lentAmount + (req.body.loanAmount || 0);
        const balanceAmountValue = totalAmountValue - lentAmountValue;
        const dateObj = new Date(req.body.loanDate) ?? new Date()

        console.log(dateObj)
        console.log(dateObj.getDate())
        console.log(getMonthName(dateObj.getMonth()))
        console.log(dateObj.getFullYear())

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

        const updateLastLoanRequest = {
            memberId: memberDetails.memberId,
            memberName: memberDetails.memberName.concat(" "+ memberDetails.fatherName),
            loanAmount: loanAmountValue,
            date: dateFormated,
            emiAmount: emiAmountValue,
            finalAmountWithInterest: finalAmountWithInterestValue,
            totalInterest: totalInterestValue,
            memberDetails: memberDetails._id
        }

        console.log(updateLastLoanRequest);

        const updateLoanDetails = await LoanDetails.create(updateLastLoanRequest)
        
        console.log("Lat Loan Id",updateLoanDetails)
        updateLastLoanRequest.loanDetails = updateLoanDetails._id

        const updatedSummary = await SummarySchema.updateOne({
            summary: updateSummaryRequest,
            lastLoan: updateLastLoanRequest
        })

        const updateMemberDetails = await MemberDetails.findOneAndUpdate({memberId: memberDetails.memberId}, {
            $set:{ 
                loanAmount: req.body.loanAmount
            }
        })

        return updatedSummary;
    }
}
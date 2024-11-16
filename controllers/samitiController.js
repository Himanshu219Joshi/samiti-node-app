const { memberList, samitiSummary, loanDeatils } = require("../mock");
const LoanDetails = require("../models/loanDetails");
const MemberDetails = require("../models/memberDetails");
const SummarySchema = require("../models/summary");


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
    }
}
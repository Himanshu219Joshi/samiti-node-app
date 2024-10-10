const { memberList, samitiSummary, loanDeatils } = require("../mock");


module.exports = {
    getMembers: () => {
        return memberList;
    }, 

    getLoanList: (req, res, next) => {
        return loanDeatils;
    },

    getSamitiSummary: (req, res, next) => {
        return samitiSummary
    }
}
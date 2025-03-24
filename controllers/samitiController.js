const { ObjectId } = require("bson");
const LoanDetails = require("../models/loanDetails");
const MemberDetails = require("../models/memberDetails");
const SummarySchema = require("../models/summary").summary;
const { getMonthName, getEmiAmount, getFinalAmountWithInterestValue, getInterest, monthDiff } = require('../utils');
const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')


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
    },

    generatePdf: async (req, res, next) => {

        const response = await MemberDetails.find({}).populate('loanDetails') 
        response.sort((a, b) => a.memberId - b.memberId)

        const totalRow = {
            totalLoanAmount: 0,
            totalInterestAmount: 0,
            totalPrinciple: 0,
            totalAmount: 0,
            totalRecovery: 0 
        }      

        response.map((member, index) => {
            const totalInterest = member?.loanDetails?.totalInterest;
            const emiAmount = member?.loanDetails?.emiAmount
            const interest = !!totalInterest ? totalInterest/20 : 0
            const principle = !!emiAmount ? emiAmount - totalInterest/20 : 0
            const totalInvest = !!emiAmount ? 500 + emiAmount : 500;

            totalRow.totalLoanAmount += member.loanAmount
            totalRow.totalInterestAmount += [21, 22].includes(member.memberId) ? 0 : interest 
            totalRow.totalPrinciple += principle
            totalRow.totalAmount += [21, 22].includes(member.memberId) ? 0 : totalInvest
            totalRow.totalRecovery += 0
        })
        

        const memberDetails = response.map(member => {
            const interest = !!member?.loanDetails?.totalInterest ? member?.loanDetails?.totalInterest/20 : 0
            const totalInvest = !!member?.loanDetails?.emiAmount ? 500 + member?.loanDetails?.emiAmount : 500;
            const principle = !!member?.loanDetails?.emiAmount ? member?.loanDetails?.emiAmount - member?.loanDetails?.totalInterest/20 : 0

            return { "सदस्य क्रमक": member.memberId, "सदस्य का नाम": `${member.memberName} ${member.fatherName}`, 
            "मासिक किस्त": '500', "ऋण राशि": `${member.loanAmount}`,
                "ब्याज": `${interest}`, "ऋण कि किस्त": `${principle}`, "कुल योग": `${totalInvest}`, 
                "बकाया ऋण राशि": "0"
             }
        })

        memberDetails.push({ "सदस्य क्रमक": ' ', "सदस्य का नाम": ' ', 
            "मासिक किस्त": ' ', "ऋण राशि": `${totalRow.totalLoanAmount}`,
                "ब्याज": `${totalRow.totalInterestAmount}`, "ऋण कि किस्त": `${totalRow.totalPrinciple}`, "कुल योग": `${totalRow.totalAmount}`, 
                "बकाया ऋण राशि": `${totalRow.totalRecovery}`
             })


        if(!!memberDetails.length && !Array.isArray(memberDetails)) {
            res.status(400).send("No Data Found");
        }
       

        const doc = new PDFDocument()
        const filePath = path.join(__dirname, "SamitiReport.pdf")

        // // console.log(filePath)
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);       
        
        
        const headers = Object.keys(memberDetails[0]);

        doc.font('./fonts/TiroDevanagariHindi-Regular.ttf');
        // doc.fontSize(18).text(headers.join(' | '), { align: 'left'}).moveDown();

        // data.forEach(row => {
            // const values = headers.map(headers => row[headers])
            // doc.text(values.join(' | '), {align: 'left'});

            generateTable(doc, memberDetails)

            doc.end();
        
        
            stream.on('finish', () => {
                res.download(filePath, 'samiti.pdf', {headers: { 'Content-type': 'application/pdf'}}, err => {
                    if(err) {
                        console.error('Error Sending File: ', err)
                        res.status(500).send("Error generating pdf")
                    }

                    fs.unlinkSync(filePath)
                })
            });
        // });
    }
}


function generateTable(doc, memberDetails) {
    const tableTop = 80; // Start position of the table
    const columnPadding = 3;
    const rowHeight = 15;
    const columnWidths = [65, 130, 70,60, 40, 80, 50, 100]; // Adjust column widths as needed
    const leftMargin = 10;
    const extraRowHeight = 5

    doc
    .rect(10, tableTop - rowHeight-30, columnWidths.reduce((a, b) => a + b), rowHeight+20)
    .fontSize(18)
    .fill('#ffff00')
    .fillColor('#000')
    .text('समिति के सभी सदस्यों का विवरन 15 मार्च 2025',    
        25, tableTop - rowHeight - 25, {align: 'center'}
    );

  
    // Table header background
    doc
        .rect(leftMargin, tableTop - rowHeight - extraRowHeight, columnWidths.reduce((a, b) => a + b), rowHeight + extraRowHeight)
        .fill('#356854');
  
    // Table headers
    const headers = Object.keys(memberDetails[0]);
    headers.forEach((header, i) => {
        doc
            .fontSize(12)
            .fillColor('#fff')
            .text(
                header.toUpperCase(),
                 8+columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + columnPadding,
                tableTop - rowHeight-extraRowHeight + columnPadding,
                { width: columnWidths[i] - columnPadding * 2, align: 'center',  }
            );

            const y = tableTop + rowHeight * i;

            doc
            .rect(leftMargin + columnWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop - rowHeight-extraRowHeight, columnWidths[i], rowHeight+extraRowHeight)
            .stroke()
            
    });
  
    // Table rows
    memberDetails.forEach((row, rowIndex) => {
        const y = tableTop + rowHeight * rowIndex;
  
        // Draw alternating row backgrounds for better readability
        if (rowIndex % 2 === 0) {
            doc
                .rect(25, y, columnWidths.reduce((a, b) => a + b), rowHeight)
                .fill('#f9f9f9');
        }
    

        // Draw row values
        headers.forEach((header, i) => {
            const x = leftMargin + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);

            if(header ===  'ब्याज') {
                doc 
                .rect(x, y, columnWidths[i], rowHeight)            
                .fill('#FFFF00')
                .fillColor('#000000')
            } else {
                doc             
                .fillColor('#000')
            }

            // last row back color and text color
            if(rowIndex === 41 && i != 0 && i != 1 && i != 2) {
                doc 
                .rect(x, y, columnWidths[i], rowHeight)            
                .fill('#FFFF00')
                .fillColor('#FF0000')
            }


            doc
                .fontSize(10)
                .text(
                    [19, 20].includes(rowIndex) &&  ['मासिक किस्त', 'कुल योग'].includes(header) ? 0 : row[header] , // Handle missing values
                     10 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + columnPadding,
                    y + columnPadding,
                    { width: columnWidths[i] - columnPadding * 2, align: 'center' }
                )

                if ([19, 20].includes(rowIndex)) {
                    doc
                    .rect(x, y, columnWidths[i], rowHeight) 
                    .fillColor('#FF0000')                
                }

                doc
                .rect(x, y, columnWidths[i], rowHeight)
                .stroke()

        });
    });
  
    // Draw table borders
    const tableHeight = rowHeight * (memberDetails.length + 1);
    doc
        .rect(leftMargin, tableTop - rowHeight- extraRowHeight - 25, columnWidths.reduce((a, b) => a + b), tableHeight+ extraRowHeight + 25)
        .stroke();
  }
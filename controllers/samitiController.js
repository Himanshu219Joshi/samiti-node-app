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
        const data = [{"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         },
         {"सदस्य क्रमक": "1", "सदस्य का नाम": 'हिमांशु भागीरथ जोशी', "मासिक किस्त": "500", "ऋण राशि": '0',
            "ब्याज": "0", "ऋण कि किस्त": '1000', "कुल योग": '500', "बकाया ऋण राशि": "0"
         }
        ]

        console.log(data.length)

        if(!!data.length && !Array.isArray(data)) {
            res.status(400).send("No Data Found");
        }
       

        const doc = new PDFDocument()
        const filePath = path.join(__dirname, "SamitiReport.pdf")

        // // console.log(filePath)
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);       
        
        
        const headers = Object.keys(data[0]);

        doc.font('./fonts/TiroDevanagariHindi-Regular.ttf');
        // doc
        //   .fontSize(18)
        //   .fillColor('#333')
        //   .text('Styled Table in PDF', { align: 'center' })
        //   .moveDown();

        // doc.fontSize(18).text(headers.join(' | '), { align: 'left'}).moveDown();

        // data.forEach(row => {
            // const values = headers.map(headers => row[headers])
            // doc.text(values.join(' | '), {align: 'left'});

            generateTable(doc, data)

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


function generateTable(doc, data) {
    const tableTop = 50; // Start position of the table
    const columnPadding = 5;
    const rowHeight = 16;
    const columnWidths = [60, 100, 60,50, 50, 80, 80, 80]; // Adjust column widths as needed
  
    // Table header background
    doc
        .rect(25, tableTop - rowHeight, columnWidths.reduce((a, b) => a + b), rowHeight)
        .fill('#f4f4f4');
  
    // Table headers
    const headers = Object.keys(data[0]);
    headers.forEach((header, i) => {
        doc
            .fontSize(12)
            .fillColor('#000')
            .text(
                header.toUpperCase(),
                 20+columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + columnPadding,
                tableTop - rowHeight + columnPadding,
                { width: columnWidths[i] - columnPadding * 2, align: 'center' }
            );

            const y = tableTop + rowHeight * i;

            doc
            .rect(25+columnWidths.slice(0, i).reduce((a, b) => a + b, 0), tableTop - rowHeight, columnWidths[i], rowHeight)
            .stroke()
            
    });
  
    // Table rows
    data.forEach((row, rowIndex) => {
        const y = tableTop + rowHeight * rowIndex;
  
        // Draw alternating row backgrounds for better readability
        if (rowIndex % 2 === 0) {
            doc
                .rect(25, y, columnWidths.reduce((a, b) => a + b), rowHeight)
                .fill('#f9f9f9');
        }
  
        // Draw row values
        headers.forEach((header, i) => {
            const x = 25 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0);


            if(header ===  'ब्याज') {
                doc 
                .rect(x, y, columnWidths[i], rowHeight)            
                .fill('#FFFF00')
                .fillColor('#000000')
            } else {
                doc             
                .fillColor('#000')
            }

            doc
                .fontSize(10)
                .text(
                    row[header], // Handle missing values
                     20 + columnWidths.slice(0, i).reduce((a, b) => a + b, 0) + columnPadding,
                    y + columnPadding,
                    { width: columnWidths[i] - columnPadding * 2, align: 'center' }
                )

                doc
                .rect(x, y, columnWidths[i], rowHeight)
                .stroke()
        });
    });
  
    // Draw table borders
    const tableHeight = rowHeight * (data.length + 1);
    doc
        .rect(25, tableTop - rowHeight, columnWidths.reduce((a, b) => a + b), tableHeight)
        .stroke();
  }
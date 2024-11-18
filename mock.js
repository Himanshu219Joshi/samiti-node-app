const memberList = [
    { "memberId": 1, "memberName": "Himanshu", "fatherName": "Bhagirath Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 2, "memberName": "Bhagirath", "fatherName": "Onkarji Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 3, "memberName": "Rajendra", "fatherName": "Bhagirath Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 4, "memberName": "Ashok",  "fatherName": "Udayram Joshi", "loanAmount": 0, "investedMoney":  2000},
    { "memberId": 5, "memberName": "Parth", "fatherName": "Ashok Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 6, "memberName": "Lata", "fatherName": "Ashok Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 7, "memberName": "Himanshu", "fatherName": "Hitesh Joshi", "loanAmount": 23000, "investedMoney": 2000 },
    { "memberId": 8, "memberName": "Vaishnavi", "fatherName": "Hitesh Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 9, "memberName": "Harsh", "fatherName": "Gajendra Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 10, "memberName": "Bhavesh", "fatherName": "Gajendra Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 11, "memberName": "Kanhayalal", "fatherName": "Shankar Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 12, "memberName": "Kuldeep", "fatherName": "Kanhayalal Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 13, "memberName": "Pragyan", "fatherName": "Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 14, "memberName": "Ramesh", "fatherName": "Champalal Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 15, "memberName": "Aditya", "fatherName": "Ramesh Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 16, "memberName": "Santosh", "fatherName": "Gopal Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 17, "memberName": "Kanhiyala", "fatherName": "Gopal Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 18, "memberName": "Suresh", "fatherName": "Narayn Joshi", "loanAmount": 23000, "investedMoney": 2000 },
    { "memberId": 19, "memberName": "Sakshi", "fatherName": "Suresh Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 20, "memberName": "Gaurav", "fatherName": "Shivprakash Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 21, "memberName": "Hardik", "fatherName": "Ashok Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 22, "memberName": "Ashok", "fatherName": "Champalal Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 23, "memberName": "Vinod", "fatherName": "Tolaram Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 24, "memberName": "Hardik", "fatherName": "Vinod Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 25, "memberName": "Jigyansh", "fatherName": "Vinod Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 26, "memberName": "Durga", "fatherName": "Vinod Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 27, "memberName": "Harish", "fatherName": "Tolaram Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 28, "memberName": "Swayam", "fatherName": "Harish Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 29, "memberName": "Priya", "fatherName": "Harish Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 30, "memberName": "Paridhi", "fatherName": "Harish Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 31, "memberName": "Ramesh", "fatherName": "Narayn Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 32, "memberName": "Bhavik", "fatherName": "Ramesh Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 33, "memberName": "Bharat", "fatherName": "Devilal Joshi", "loanAmount": 20000, "investedMoney": 2000 },
    { "memberId": 34, "memberName": "Mahesh", "fatherName": "Ramji Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 35, "memberName": "Chirag", "fatherName": "Mahesh Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 36, "memberName": "Raju", "fatherName": "Bhagwanji Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 37, "memberName": "Pravin", "fatherName": "Narayan Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 38, "memberName": "Prakash", "fatherName": "Premji Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 39, "memberName": "Dilip", "fatherName": "Dhanraj Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 40, "memberName": "Sagar", "fatherName": "Maganlal Joshi", "loanAmount": 0, "investedMoney": 2000 },
    { "memberId": 41, "memberName": "Aayush", "fatherName": "Dinesh Joshi", "loanAmount": 0, "investedMoney": 2000 },
  ];

  const samitiSummary =  {
    summary: {
      totalAmount: 66591,
      lentAmount: 66591,
      balanceAmount: 591,
      interest: 0
    },
    lastLoan: {
      memberId: 1, 
      memberName: "Bharat Joshi",
      loanAmount: 20000,
      date: "15-Jun-2024"
    },

  }

  // formula for calculating EMI reducing rate

  // EMI = P * R * (1 + r)^tenure in month / ((1+r)^tenure in month - 1)
  // for ex 20000 * 0.01 * (1 + 0.01)^20 / ((1 + 0.01)^20-1) = 1108.33
  // Interest Calulation = (EMI * Tenure in month) - P   
  // for ex 1108 * 20 - 20000 = 2160 



  const loanDeatils = [
    {
      memberId: 1, 
      memberName: "Bharat Joshi",
      loanAmount: 20000,
      date: "15-Jul-2024"
    },
    {
      memberId: 2,
      memberName: "Hitesh Joshi",
      loanAmount: 23000,
      date: "15-Aug-2024"
    },
    {
      memberId: 3,
      memberName: "Suresh Joshi",
      loanAmount: 23000,
      date: "15-Sept-2024"
    },
    {
      memberId: 4,
      memberName: "Mahesh Joshi",
      loanAmount: 25000,
      date: "15-Oct-2024" 
    },
    {
      memberId: 5,
      memberName: "Yogesh Joshi",
      loanAmount: 25000,
      date: "15-Nov-2024" 
    }
  ]

  const loginUsers = [
    { id: 1, mobileNo: '1234567890', password: '1234' },
    { id: 2, mobileNo: '9860788148', password: '1234' }
  ];

  module.exports = {
    samitiSummary,
    loanDeatils,
    memberList,
    loginUsers
  }


  
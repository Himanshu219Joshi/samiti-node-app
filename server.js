// Step 1: Initialize a new Node.js project
// Run the following commands in your terminal:
// npm init -y
// npm install express

// Step 2: Create an Express server

const express = require('express');
const app = express();
const port = 3000;

// Sample data
const data = [
  { id: 1, memberName: 'Himanshu', loanAmount: 5000, investedMoney: 2000 },
  { id: 2, memberName: 'Rajendra', loanAmount: 10000, investedMoney: 5000 },
  { id: 3, memberName: 'Dilip', loanAmount: 7500, investedMoney: 3000 },
  { id: 4, memberName: 'Himanshu', loanAmount: 5000, investedMoney: 2000 },
  { id: 5, memberName: 'Rajendra', loanAmount: 10000, investedMoney: 5000 },
  { id: 6, memberName: 'Dilip', loanAmount: 7500, investedMoney: 3000 },
  { id: 7, memberName: 'Himanshu', loanAmount: 5000, investedMoney: 2000 },
  { id: 8, memberName: 'Rajendra', loanAmount: 10000, investedMoney: 5000 },
  { id: 9, memberName: 'Dilip', loanAmount: 7500, investedMoney: 3000 },
  { id: 10, memberName: 'Himanshu', loanAmount: 5000, investedMoney: 2000 },
  { id: 11, memberName: 'Rajendra', loanAmount: 10000, investedMoney: 5000 },
  { id: 12, memberName: 'Dilip', loanAmount: 7500, investedMoney: 3000 },
];

// Step 3: Define endpoints

// Get all data
app.get('/data', (req, res) => {
  res.json(data);
});

// Get data by ID
app.get('/data/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = data.find(d => d.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).send({ error: 'Data not found' });
  }
});

// Step 4: Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
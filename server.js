'use strict'
      
// require express and bodyParser  
const  express = require("express");
const  bodyParser = require("body-parser");
const router = express.Router();
const audit = require('express-requests-logger')
const authenticateToken = require('./middleware/auth')
const SECRET_KEY = "testSamitiApp"
// Include route files
const userRoutes = require('./routes/userRoutes')
const samitiRoutes = require('./routes/samitiRoutes');
const scheduleRoutes = require('./routes/scheduleRoute');
const samitiData = require('./controllers/samitiController')
const { loginUsers } = require("./mock");
const User = require('./models/user')

const path = require('path')
// Import DB Connection
const connectDB = require("./config/db");

connectDB();


const timeLog = (req, res, next) => {
  console.log('Time: ', `${new Date().toLocaleTimeString()}`)

}
router.use(timeLog)
// create express app
const  app = express();  

const jwt = require('jsonwebtoken');

// import bcryptjs - hashing function 
const bcrypt = require('bcryptjs');
const samitiController = require("./controllers/samitiController");

const users = loginUsers;
// use bodyParser middleware on express app   
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'  }));  
app.use(bodyParser.json({limit: '50mb'}));



// define port to run express app
const  port = process.env.PORT || 3000;

// Use routes
app.get('/', (req, res) => {
  res.send("This is samiti app");
})

// Middleware to parse JSON request body
app.use(express.json());

// Function to draw a styled table

app.get('/generatePdf', async (req, res, next) => {
    const response = await samitiData.generatePdf(req, res);
    const filePath = path.join(__dirname, "SamitiReport.pdf")
    // res.download(response, "Samiti.pdf", {headers: { 'Content-type': 'application/pdf'}}, err=> console.error(err))
    // res.setHeader('Content-type', 'application/pdf')
    // res.setHeader('Content-Disposition', 'attachment; filename=table.pdf')
    
    res.download(filePath, "table.pdf", {}, err => {
      if(err){
        console.error(err)
      } else {
        console.log("no issue")
      }
    } )
  
})

app.use("/", scheduleRoutes)
app.use('/', userRoutes)
app.use('/samiti', authenticateToken, samitiRoutes);

// Listen to server
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});


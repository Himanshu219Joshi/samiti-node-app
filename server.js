'use strict'
      
// require express and bodyParser  
const  express = require("express");
const  bodyParser = require("body-parser");
const router = express.Router();
const audit = require('express-requests-logger')
const authenticateToken = require('./middleware/auth')
const SECRET_KEY = "testSamitiApp"

// Import DB Connection
require("./config/db");


const timeLog = (req, res, next) => {
  console.log('Time: ', `${new Date().toLocaleTimeString()}`)

}
router.use(timeLog)
// create express app
const  app = express();  

const jwt = require('jsonwebtoken');

// import bcryptjs - hashing function 
const bcrypt = require('bcryptjs');

const users =
// use bodyParser middleware on express app   
app.use(bodyParser.urlencoded({ extended:  true }));  
app.use(bodyParser.json());

app.post('/login', (req, res) => {
  console.log(req.body);
  const { mobileNo, password } = req.body;
  const user = users.find(u => u.mobileNo === mobileNo && u.password === password);

  if (!user) {
    return res.status(400).send('Mobile or Password is incorrect');
  }

  const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '15m' });
  res.json({ token });
});

// define port to run express app
const  port = process.env.PORT || 3000;

// Include route files
const userRoutes = require('./routes/userRoutes')
const samitiRoutes = require('./routes/samitiRoutes');

// Use routes
app.get('/', (req, res) => {
  res.send("This is samiti app");
})

app.use('/user', userRoutes)
app.use('/samiti', authenticateToken, samitiRoutes);

// Listen to server
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});


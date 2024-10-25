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
const { loginUsers } = require("./mock");
const User = require('./models/user')

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

const users = loginUsers;
// use bodyParser middleware on express app   
app.use(bodyParser.urlencoded({ extended:  true }));  
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  console.log(req.body);
  const { mobileNumber } = req.body;
  

  const user = await User.findOne({mobileNumber: mobileNumber}).then(user => user);

  if (!user) {
    return res.status(400).send('Mobile or Password is incorrect');
  }

  console.log(user);
  const token = jwt.sign({ mobileNumber: user.mobileNumber }, SECRET_KEY, { expiresIn: '15m' });
  res.json({ token, userInfo: user });
});

// define port to run express app
const  port = process.env.PORT || 3000;



// Use routes
app.get('/', (req, res) => {
  res.send("This is samiti app");
})

app.use('/', userRoutes)
app.use('/samiti', authenticateToken, samitiRoutes);

// Listen to server
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});


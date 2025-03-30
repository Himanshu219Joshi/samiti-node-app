const mongoose = require('mongoose');

// local server 
const uri = "mongodb://localhost:27017/samiti?retryWrites=true&w=majority&appName=samiticluster";
// real server
// const uri = "mongodb+srv://samitiapp:samitiapp@samiticluster.by7ml.mongodb.net/samiti?retryWrites=true&w=majority&appName=samiticluster";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

// const uri = "mongodb+srv://<db_username>:<db_password>@samiticluster.by7ml.mongodb.net/?retryWrites=true&w=majority&appName=samiticluster";
// const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
// async function run() {
//   try {
//     // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
//     await mongoose.connect(uri, clientOptions);
//     await mongoose.connection.db.admin().command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await mongoose.disconnect();
//   }
// }
// run().catch(console.dir);

const connectDB = async () => {
    try {
      const conn = await mongoose.connect(uri, clientOptions);
      console.log(`MongoDB Connected: {conn.connection.host}`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }

  module.exports = connectDB;   
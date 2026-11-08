const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = require('./app');

const DB = process.env.DATABASE;
const port = process.env.PORT || 3000;


mongoose
  .connect(DB)
  .then(() => {
    console.log('DB connection successful!');

    app.listen(port, () => {
      console.log(`App running on  http://localhost/${port}`);
    });
  })
  .catch((err) => {
    console.log('DB connection failed:', err.message);
    process.exit(1); 
  });
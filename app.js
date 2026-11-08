const express = require('express');

const app = express();

// 1) MIDDLEWARES
app.use(express.json()); // lets us read JSON from req.body

// 2) ROUTES
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the ReadMore API'
  });
});

module.exports = app;
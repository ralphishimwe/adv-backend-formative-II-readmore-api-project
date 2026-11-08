const express = require('express');
const authorRouter = require("./routes/authorRoutes");
const app = express();

// Middleware json parsing
app.use(express.json());


// ROUTES
app.get("/", (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the ReadMore API'
  });
});

app.use("/authors", authorRouter);

module.exports = app;
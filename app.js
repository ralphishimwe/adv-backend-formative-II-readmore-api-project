const express = require('express');
const authorRouter = require("./routes/authorRoutes");
const bookRouter = require("./routes/bookRoutes");
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
app.use("/books", bookRouter);

// Any route not matched above
app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server`,
  });
});

module.exports = app;
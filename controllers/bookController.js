const Book = require("../models/bookModel");

//POST /books
exports.createBook = async (req, res) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json({
      status: "success",
      data: { book: newBook },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

//GET /books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("author");

    res.status(200).json({
      status: "success",
      results: books.length,
      data: { books },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// GET /books/:id
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author");

    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: `No book found with ID ${req.params.id}`,
      });
    }

    res.status(200).json({
      status: "success",
      data: { book },
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: `Invalid ${err.path}: ${err.value}`,
      });
    }
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// PUT /books/:id
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: `No book found with ID ${req.params.id}`,
      });
    }

    res.status(200).json({
      status: "success",
      data: { book },
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: `Invalid ${err.path}: ${err.value}`,
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
  }
};

// DELETE /books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: `No book found with id ${req.params.id}`,
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: `Invalid ${err.path}: ${err.value}`,
      });
    }
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
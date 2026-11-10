const Book = require("../models/bookModel");
const Author = require("../models/authorModel");

//Rule 3 validates price and year and returns error if somethings is wrong
const checkPriceAndYear = (price, publishedYear) => {
  const currentYear = new Date().getFullYear();
  if (price !== undefined && price <= 0) {
    return "Price must be greater than 0";
  }

  if (
    publishedYear !== undefined &&
    (publishedYear < 1500 || publishedYear > currentYear)
  ) {
    return `Published year must be between 1500 and ${currentYear}`;
  }
  return null;
};

//Rule 2 - lokos for a book by the same author and same title {$ne/not equal}
const findDuplicateTitle = (title, authorId, excludeBookId) => {
  const filter = { title: String(title).trim(), author: authorId };
  if (excludeBookId) {
    filter._id = { $ne: excludeBookId };
  }
  return Book.findOne(filter).collation({ locale: "en", strength: 2 });
};

//POST /books
exports.createBook = async (req, res) => {
  try {
    //checks if there is req.body if none returns error message
    if (!req.body) {
      return res.status(400).json({
        status: "fail",
        message: "No Request body found",
      });
    }

    const { title, price, publishedYear, author } = req.body;
    //rule3 validating price and publishedYear
    const ruleError = checkPriceAndYear(price, publishedYear);
    if (ruleError) {
      return res.status(422).json({
        status: "fail",
        message: ruleError,
      });
    }

    //Rule 1 - author must exist
    if (author) {
      const authorExists = await Author.exists({ _id: author });
      if (!authorExists) {
        return res.status(400).json({
          status: "fail",
          message: `No author found with ID ${author}. A book must belong to an existing author.`,
        });
      }
    }

    //rule 2: same author can't have the same title
    if (title && author) {
      const duplicate = await findDuplicateTitle(title, author);
      if (duplicate) {
        return res.status(409).json({
          status: "fail",
          message: `This author already has a book titled "${duplicate.title}`,
        });
      }
    }

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
    //checks if there is req.body if none returns error message
    if (!req.body) {
      return res.status(400).json({
        status: "fail",
        message: "No Request body found",
      });
    }
    const { title, price, publishedYear, author } = req.body;

    //checking if the book exists
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: "fail",
        message: `No book found with ID ${req.params.id}`,
      });
    }

    //rule 3 price and year must be validated
    const ruleError = checkPriceAndYear(price, publishedYear);
    if (ruleError) {
      return res.status(422).json({
        status: "fail",
        message: ruleError,
      });
    }

    //rule 1 validating if author is being changed new author must existing
    if (author !== undefined) {
      const authorExists = await Author.exists({ _id: author });
      if (!authorExists) {
        return res.status(400).json({
          status: "fail",
          message: `No author found with ID ${author}, book must belong to an existing author.`,
        });
      }
    }

    // rule2: when updating author no same author for same book title
    if (title !== undefined || author !== undefined) {
      //if user sents value use that if not use the current
      const finalTitle = title || book.title;
      const finalAuthor = author || book.author;

      const duplicate = await findDuplicateTitle(
        finalTitle,
        finalAuthor,
        book._id,
      );
      if (duplicate) {
        return res.status(409).json({
          status: "fail",
          message: `This author already has a book titled "${duplicate.title}"`,
        });
      }
    }

    //saving the update
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { book: updatedBook },
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

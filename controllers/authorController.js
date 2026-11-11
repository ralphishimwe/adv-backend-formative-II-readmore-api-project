const Author = require("../models/authorModel");
const Book = require("../models/bookModel");

//POST /authors
exports.createAuthor = async (req, res) => {
  try {
    const newAuthor = await Author.create(req.body);

    res.status(201).json({
      status: "success",
      data: { author: newAuthor },
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

// GET /authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find();

    res.status(200).json({
      status: "success",
      results: authors.length,
      data: { authors },
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

//GET /authors/:id
exports.getAuthor = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        status: "fail",
        message: `No author found with ID ${req.params.id}`,
      });
    }

    res.status(200).json({
      status: "success",
      data: { author },
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: `Invalid ID: ${err.value}`,
      });
    }
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// PUT /authors/:id
exports.updateAuthor = async (req, res) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!author) {
      return res.status(404).json({
        status: "fail",
        message: `No author found with id ${req.params.id}`,
      });
    }
    res.status(200).json({
      status: "success",
      data: { author },
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: `Invalid id: ${err.value}`,
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

// DELETE /authors/:id
// Rule 4 – Policy A: block the delete if the author still has books
exports.deleteAuthor = async (req, res) => {
  try {
    // checking if the author exists
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        status: "fail",
        message: `No author found with ID ${req.params.id}`,
      });
    }

    // how many books still belong to this author
    const bookCount = await Book.countDocuments({ author: req.params.id });

    if (bookCount > 0) {
      return res.status(409).json({
        status: "fail",
        message: `Cannot delete ${author.name}: they still have ${bookCount} book(s). Delete or reassign those books first.`,
      });
    }

    // No books  we can delete
    await Author.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: `Invalid ID: ${err.value}`,
      });
    }
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// GET /authors/:id/books
exports.getAuthorBooks = async (req, res) => {
  try {
    //checking if author exists
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({
        status: "fail",
        message: `No author found with ID ${req.params.id}`,
      });
    }

    // find everybook where author matches the ID
    const books = await Book.find({ author: req.params.id });
    res.status(200).json({
      status: "success",
      author: author.name,
      results: books.length,
      data: { books },
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: `Invalid ID: ${err.value}`,
      });
    }
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// GET /authors/:id/stats
exports.getAuthorStats = async (req, res) => {
  try {
    // checking if author exists
    const author = await Author.findById(req.params.id);

    if (!author) {
      return res.status(404).json({
        status: "fail",
        message: `No author found with ID ${req.params.id}`,
      });
    }

    //Getting author's books, cheapest first
    const books = await Book.find({ author: req.params.id }).sort({
      price: 1,
      _id: 1,
    });

    // No books yet, return sensible empty values instead of crashing
    if (books.length === 0) {
      return res.status(200).json({
        status: "success",
        author: author.name,
        bookCount: 0,
        averagePrice: null,
        cheapestBook: null,
        mostExpensiveBook: null,
      });
    }

    //calculating the stats
    const totalPrice = books.reduce((sum, book) => sum + book.price, 0);
    const averagePrice = Math.round((totalPrice / books.length) * 100) / 100; // 2 decimal places

    res.status(200).json({
      status: "success",
      author: author.name,
      bookCount: books.length,
      averagePrice,
      cheapestBook: books[0].title, 
      mostExpensiveBook: books[books.length - 1].title,
    });
  } catch (err) {
    if (err.name === "CastError") {
      return res.status(400).json({
        status: "fail",
        message: `Invalid ID: ${err.value}`,
      });
    }
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

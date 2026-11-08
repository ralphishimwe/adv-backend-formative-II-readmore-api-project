const Author = require("../models/authorModel");

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
exports.deleteAuthor = async (req, res) => {
    try{
        const author = await Author.findByIdAndDelete(req.params.id);
    
        if(!author) {
            return res.status(404).json({
                status: "fail",
                message: `No author found with ID ${req.params.id}`,
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
                message: `Invalid ID: ${err.value}`
            });
        }
        res.status(500).json({
            status: "error",
            message: err.message
        });
    }
};
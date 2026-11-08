const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "A book must have a title"],
      trim: true,
    },
    genre: {
      type: String,
      required: [true, "A book must have a genre"],
      trim: true,
    },
    price: {
      type: Number,
      require: [true, "A book must have a price"],
    },
    publishedYear: {
      type: Number,
      required: [true, "A book must have a published year"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      require: [true, "A book must belong to an author"],
    },
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;

const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "An author must have a name"],
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const Author = mongoose.model("Author", authorSchema);

module.exports = Author;

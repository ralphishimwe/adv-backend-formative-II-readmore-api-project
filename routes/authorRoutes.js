const express = require("express");
const authorController = require("../controllers/authorController");

const router = express.Router();

router
  .route("/")
  .get(authorController.getAllAuthors)
  .post(authorController.createAuthor);

router
  .route("/:id")
  .get(authorController.getAuthor)
  .put(authorController.updateAuthor)
  .delete(authorController.deleteAuthor);

router.route("/:id/books").get(authorController.getAuthorBooks);
router.route("/:id/stats").get(authorController.getAuthorStats);

module.exports = router;

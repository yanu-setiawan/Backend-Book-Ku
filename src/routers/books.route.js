const { Router } = require("express");

const booksController = require("../controllers/books.controller");
const booksRouter = Router();
const { memoryUpload, errorHandler } = require("../middlewares/memoryUpload");

booksRouter.get("/", booksController.getAllBook);

booksRouter.post(
  "/create-book",
  (req, res, next) =>
    memoryUpload.single("image_url")(req, res, (err) => {
      errorHandler(err, res, next);
    }),
  booksController.insertBook
);

module.exports = booksRouter;

const { Router } = require("express");

const categoriesController = require("../controllers/categories.controller");

const categoriesRouter = Router();

categoriesRouter.get("/", categoriesController.getCategory);
categoriesRouter.post("/create-ctg", categoriesController.createCategory);
categoriesRouter.patch("/:id", categoriesController.updateCategory);
categoriesRouter.delete("/:id", categoriesController.deleteCategory);
categoriesRouter.get("/:id/books", categoriesController.getBookByCategory);

module.exports = categoriesRouter;

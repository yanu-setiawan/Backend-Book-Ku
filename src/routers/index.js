const { Router } = require("express");

const usersRouter = require("./users.route");
const categoriesRouter = require("./categories.route");
const bookRouter = require("./books.route");

//auth

const masterRouter = Router();

masterRouter.use("/users", usersRouter);
masterRouter.use("/categories", categoriesRouter);
masterRouter.use("/book", bookRouter);

module.exports = masterRouter;

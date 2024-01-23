const { Router } = require("express");

const usersController = require("../controllers/users.controller");

const usersRouter = Router();

// localhost/users
usersRouter.get("/", usersController.getUsers);
usersRouter.post("/register", usersController.insertUsers);
usersRouter.post("/login", usersController.login);

module.exports = usersRouter;

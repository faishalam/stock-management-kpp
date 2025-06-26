const express = require("express");
const UserController = require("../controllers/userControllers");
const authentication = require("../middlewares/authentication");
const userRouter = express.Router();

userRouter.post("/register", UserController.createUser);
userRouter.post("/login", UserController.login);
userRouter.get("/user", UserController.getAllUser);
userRouter.get(
  "/getLoggedInUser",
  authentication,
  UserController.getLoggedInUser
);
userRouter.get("/user/:id", authentication, UserController.getUserDetail);
userRouter.put("/user/:id", authentication, UserController.updateUser);
userRouter.delete("/user/:id", authentication, UserController.deleteUser);

module.exports = userRouter;

const express = require("express");
const authentication = require("../middlewares/authentication.js");
const MaterialController = require("../controllers/materialControllers.js");
const materialRouter = express.Router();

materialRouter.use(authentication);
materialRouter.post("/material", MaterialController.createMaterial);
materialRouter.get("/material", MaterialController.getAllMaterial);
materialRouter.get("/material/:id", MaterialController.getMaterialById);
materialRouter.put("/material/:id", MaterialController.updateMaterial);
materialRouter.delete("/material/:id", MaterialController.deleteMaterial);

module.exports = materialRouter;

const express = require("express");
const authentication = require("../middlewares/authentication.js");
const materialRouter = require("./materialRouter.js");
const requestMaterialRouter = express.Router();
const MaterialRequestController = require("../controllers/requestMaterialControllers.js");

requestMaterialRouter.use(authentication);
requestMaterialRouter.post(
  "/request-material",
  MaterialRequestController.createMaterialRequest
);
requestMaterialRouter.get(
  "/request-material",
  MaterialRequestController.getMaterialRequest
);
requestMaterialRouter.put(
  "/request-material/:id",
  MaterialRequestController.updateMaterialRequest
);
requestMaterialRouter.delete(
  "/request-material/:id",
  MaterialRequestController.deleteMaterialRequest
);
requestMaterialRouter.put(
  "/request-material/status/:id",
  MaterialRequestController.updateStatus
);


module.exports = requestMaterialRouter;

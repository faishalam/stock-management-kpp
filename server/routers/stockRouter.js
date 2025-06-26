const express = require("express");
const StockController = require("../controllers/stockControllers.js");
const authentication = require("../middlewares/authentication.js");
const authorization = require("../middlewares/authorization.js");
const stockRouter = express.Router();

stockRouter.use(authentication);
stockRouter.use(authorization);
stockRouter.post("/stock", StockController.createStock);
stockRouter.get("/stock", StockController.getStocks);
stockRouter.get("/stock/trend", StockController.getTrendStock);
stockRouter.put("/stock/status", StockController.updateStatus);
stockRouter.get("/stock/:id", StockController.getStockById);
stockRouter.put("/stock/:id", StockController.updateStock);
stockRouter.put("/stock/price/:id", StockController.updateStockPrice);
stockRouter.delete("/stock/:id", StockController.deleteStock);

module.exports = stockRouter;

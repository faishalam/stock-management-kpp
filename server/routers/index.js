const express = require("express");
const userRouter = require("./userRouter");
const stockRouter = require("./stockRouter");
const materialRouter = require("./materialRouter");
const requestMaterialRouter = require("./requestMaterial");

const router = express.Router();

router.use("/", userRouter);
router.use("/", stockRouter);
router.use("/", materialRouter);
router.use("/", requestMaterialRouter);

module.exports = router;

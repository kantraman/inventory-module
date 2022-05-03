const express = require("express");
const auth = require("../helpers/auth");
const {
    getSummary4DashBoard,
    getPurchaseOrderSummary,
    getSalesOrderSummary
 } = require("../controller/dashboardController");

const dashBoardRouter = express.Router();

dashBoardRouter.get("/general-summary", auth, (req, res) => getSummary4DashBoard(req, res));
dashBoardRouter.get("/salesorder-summary", auth, (req, res) => getSalesOrderSummary(req, res));
dashBoardRouter.get("/purchaseorder-summary", auth, (req, res) => getPurchaseOrderSummary(req, res));


module.exports = dashBoardRouter;
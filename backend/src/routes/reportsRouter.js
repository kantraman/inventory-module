const express = require("express");
const auth = require("../helpers/auth");

const {
    getInventorySummary,
    getInventorySummaryExcel
} = require("../controller/reportController");

const reportsRouter = express.Router();

reportsRouter.get("/inventory-summary", auth, (req, res) => getInventorySummary(req, res));
reportsRouter.get("/export-inventory-summary", auth, (req, res) => getInventorySummaryExcel(req, res));

module.exports = reportsRouter;
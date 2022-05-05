const express = require("express");
const auth = require("../helpers/auth");

const { getInventorySummary } = require("../controller/reportController");

const reportsRouter = express.Router();

reportsRouter.get("/inventory-summary", (req, res) => getInventorySummary(req, res));

module.exports = reportsRouter;
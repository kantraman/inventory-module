const express = require("express");
const auth = require("../helpers/auth");

const {
    getInventorySummary,
    getInventorySummaryExcel,
    getProductSalesReport,
    getProductSalesReportExcel,
    getCustomerSalesReport,
    getCustomerSalesReportExcel
} = require("../controller/reportController");

const reportsRouter = express.Router();

//Inventory summary
reportsRouter.get("/inventory-summary", auth, (req, res) => getInventorySummary(req, res));
reportsRouter.get("/export-inventory-summary", auth, (req, res) => getInventorySummaryExcel(req, res));

//Product sales report
reportsRouter.get("/product-sales", auth, (req, res) => getProductSalesReport(req, res));
reportsRouter.get("/export-product-sales", auth, (req, res) => getProductSalesReportExcel(req, res));

//Customer sales report
reportsRouter.get("/customer-sales", (req, res) => getCustomerSalesReport(req, res));
reportsRouter.get("/export-customer-sales", auth, (req, res) => getCustomerSalesReportExcel(req, res));


module.exports = reportsRouter;
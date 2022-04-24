const express = require("express");
const {
    insertCustomer,
    updateCustomer,
    getCustomer
} = require("../controller/customerController");
const {
    insertSalesOrder,
    updateSalesOrder,
    getSalesOrder,
    getSalesOrder4Period,
    getSalesOrderForm
} = require("../controller/salesController");
const auth = require("../helpers/auth");

const salesRouter = express.Router();

//Customers
salesRouter.post("/customer", auth, (req, res) => insertCustomer(req, res));
salesRouter.put("/customer/:id/update", auth, (req, res) => updateCustomer(req, res));
salesRouter.get("/customer/:id", auth, (req, res) => getCustomer(req, res));

//Sales Order
salesRouter.post("/sales-order", auth, (req, res) => insertSalesOrder(req, res));
salesRouter.put("/sales-order/:id/update", auth, (req, res) => updateSalesOrder(req, res));
salesRouter.get("/sales-order/:id", auth, (req, res) => getSalesOrder(req, res));
salesRouter.get("/sales-order", auth, (req, res) => getSalesOrder4Period(req, res));
salesRouter.get("/so-form/:id", auth, (req, res) => getSalesOrderForm(req, res));

module.exports = salesRouter;
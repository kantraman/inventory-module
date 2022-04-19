const express = require("express");
const {
    insertCustomer,
    updateCustomer,
    getCustomer
} = require("../controller/customerController");
const {
    insertSalesOrder,
    updateSalesOrder,
    getSalesOrder
} = require("../controller/salesController");
const auth = require("../helpers/auth");

const salesRouter = express.Router();

//Customers
salesRouter.post("/customer", auth, (req, res) => insertCustomer(req, res));
salesRouter.put("/customer/:id/update", auth, (req, res) => updateCustomer(req, res));
salesRouter.get("/customer/:id", auth, (req, res) => getCustomer(req, res));

//Sales Order
salesRouter.post("/sales-order", auth, (req, res) => insertSalesOrder(req, res));
salesRouter.post("/sales-order/:id/update", auth, (req, res) => updateSalesOrder(req, res));
salesRouter.post("/sales-order/:id", auth, (req, res) => getSalesOrder(req, res));

module.exports = salesRouter;
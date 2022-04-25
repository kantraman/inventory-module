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
const {
    insertPackage,
    updatePackage,
    getPackage
} = require("../controller/packageController");

const auth = require("../helpers/auth");
const {
    insertDeliveryChallan,
    updateDeliveryChallan,
    getDeliveryChallan
} = require("../controller/challanController");

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

//Package
salesRouter.post("/package", auth, (req, res) => insertPackage(req, res));
salesRouter.put("/package/:id/update", auth, (req, res) => updatePackage(req, res));
salesRouter.get("/package/:id", auth, (req, res) => getPackage(req, res));

//Delivery Challan
salesRouter.post("/challan", auth, (req, res) => insertDeliveryChallan(req, res));
salesRouter.put("/challan/:id/update", auth, (req, res) => updateDeliveryChallan(req, res));
salesRouter.get("/challan/:id", auth, (req, res) => getDeliveryChallan(req, res));


module.exports = salesRouter;
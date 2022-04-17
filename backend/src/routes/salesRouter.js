const express = require("express");
const {
    insertCustomer,
    updateCustomer,
    getCustomer
} = require("../controller/customerController");
const auth = require("../helpers/auth");

const salesRouter = express.Router();

//Customers
salesRouter.post("/customer", auth, (req, res) => insertCustomer(req, res));
salesRouter.put("/customer/:id/update", auth, (req, res) => updateCustomer(req, res));
salesRouter.get("/customer/:id", auth, (req, res) => getCustomer(req, res));

module.exports = salesRouter;
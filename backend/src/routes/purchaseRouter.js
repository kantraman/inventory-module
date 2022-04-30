const express = require("express");
const auth = require("../helpers/auth");

const {
    insertVendor,
    updateVendor,
    getVendor
} = require("../controller/vendorController");
const {
    insertPurchaseOrder,
    updatePurchaseOrder,
    getPurchaseOrder,
    getPurchaseOrderForm
} = require("../controller/purchaseController");

const purchaseRouter = express.Router();

//Vendors
purchaseRouter.post("/vendor", auth, (req, res) => insertVendor(req, res));
purchaseRouter.put("/vendor/:id/update", auth, (req, res) => updateVendor(req, res));
purchaseRouter.get("/vendor/:id", auth, (req, res) => getVendor(req, res));

//Purchase Order
purchaseRouter.post("/purchase-order", auth, (req, res) => insertPurchaseOrder(req, res));
purchaseRouter.put("/purchase-order/:id/update", auth, (req, res) => updatePurchaseOrder(req, res));
purchaseRouter.get("/purchase-order/:id", auth, (req, res) => getPurchaseOrder(req, res));
purchaseRouter.get("/po-form/:id", auth, (req, res) => getPurchaseOrderForm(req, res));

module.exports = purchaseRouter;
const BillPayment = require("../model/BillsPayment");
const Bills = require("../model/BillsPayable");
const CreditNote = require("../model/CreditNote");
const Customers = require("../model/Customer");
const DeliveryChallan = require("../model/DeliveryChallan");
const Invoices = require("../model/Invoice");
const ItemGroups = require("../model/ItemGroups");
const InvAdjustments = require("../model/InventoryAdjustments");
const Items = require("../model/Items");
const Packages = require("../model/Package");
const PaymentsRec = require("../model/PaymentsRec");
const PurchaseOrder = require("../model/PurchaseOrder");
const SalesOrder = require("../model/SalesOrder");
const SalesReturn = require("../model/SalesReturn");
const Vendors = require("../model/Vendor");
const VendorCreditNote = require("../model/VendorCreditNote");


//Get statistics for dashboard
const getSummary4DashBoard = async (req, res) => {
    try {
        let noOfItems = await Items.count();
        let noOfItemGroups = await ItemGroups.count();
        let noOfCustomers = await Customers.count();
        let noOfVendors = await Vendors.count();

        const dashBoard = {
            items: noOfItems,
            itemGroups: noOfItemGroups,
            customers: noOfCustomers,
            vendors: noOfVendors
        }

        res.json(dashBoard);
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

const getSummaryMonthly = async (req, res, Collection, field) => {
    try {
        const month = new Date().getMonth() + 1;
        const status = await Collection
            .aggregate()
            .redact({
                "$cond": [
                    { "$eq": [{ "$month": field }, month] },
                    "$$KEEP",
                    "$$PRUNE"
                ]
            })
            .group({
                _id: "$status",
                count: { $sum: 1 }
            });
        res.json(status);
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

//Get Sales Order Summary Monthly
const getSalesOrderSummary = async (req, res) => {
    getSummaryMonthly(req, res, SalesOrder, "$orderDate");
};

//Get Purchase Order Summary Monthly
const getPurchaseOrderSummary = async (req, res) => {
    getSummaryMonthly(req, res, PurchaseOrder, "$orderDate");
};


module.exports = {
    getSummary4DashBoard,
    getSalesOrderSummary,
    getPurchaseOrderSummary
}
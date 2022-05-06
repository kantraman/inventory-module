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
const { getItemStock } = require("./dashboardController");
const inventorySummaryTemplate = require("../reports/inventorySummary");
const convertToPdf = require("../helpers/htmltopdf");
const convertJsonToExcel = require("../helpers/convertToExcel");


const getInventoryReportData = async () => {
    const inventorySummary = [];
    let items = await Items.find({})

    for (let item in items) {
        let itemDetails = await getItemStock(items[item].itemID, true);
        let inventoryItem = {
            itemID: items[item].itemID,
            itemName: items[item].itemName,
            reorderLevel: items[item].reorderPoint,
            openingStock: items[item].openingStock,
            quantityIn: itemDetails.itemPurchase,
            quantityOut: itemDetails.itemSales,
            quantityOrdered: await getOrderedQuantity(items[item].itemID),
            commitedQuantity: await getCommitedQuantity(items[item].itemID),
            stockOnHand: itemDetails.itemStock,
            invAdj: itemDetails.invAdj 
        }
        inventorySummary.push(inventoryItem);
    }
    
    return inventorySummary;
}

const getCommitedQuantity = async (itemID) => {
    let quantity = 0;
    let salesOrder = await SalesOrder.aggregate()
        .match({ status: "Confirmed" })
        .unwind({
            path: "$items",
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: true
        })
        .match({ "items.itemID": itemID })
        .group({
            _id: "$items.itemID", quantity: { $sum: "$items.quantity" }
        });
    if (salesOrder.length > 0)
        quantity = salesOrder[0].quantity;
    
    return quantity;
}

const getOrderedQuantity = async (itemID) => {
    let quantity = 0;
    let purchaseOrder = await PurchaseOrder.aggregate()
        .match({ status: "Issued" })
        .unwind({
            path: "$items",
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: true
        })
        .match({ "items.itemID": itemID })
        .group({
            _id: "$items.itemID", quantity: { $sum: "$items.quantity" }
        });
    if (purchaseOrder.length > 0)
        quantity = purchaseOrder[0].quantity;
    
    return quantity;
}

const getInventorySummary = async (req, res) => {
    try {
        let inventorySummary = await getInventoryReportData();
        let template = inventorySummaryTemplate(inventorySummary);
        
        convertToPdf(template, res, "landscape");

    } catch (error) {
        console.log(error);
    }
}

const getInventorySummaryExcel = async (req, res) => {
    try {
        let inventorySummary = await getInventoryReportData();
       
        convertJsonToExcel(inventorySummary,"Inventory Summary", res);

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    getInventorySummary,
    getInventorySummaryExcel
}
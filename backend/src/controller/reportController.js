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
const productSalesTemplate = require("../reports/productSalesReport");
const customerSalesTemplate = require("../reports/customerSalesReport");
const convertToPdf = require("../helpers/htmltopdf");
const convertJsonToExcel = require("../helpers/convertToExcel");

//Get data for inventory summary
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

//Get inventory summary in pdf format
const getInventorySummary = async (req, res) => {
    try {
        let inventorySummary = await getInventoryReportData();
        let template = inventorySummaryTemplate(inventorySummary);
        
        convertToPdf(template, res, "landscape");

    } catch (error) {
        console.log(error);
    }
}

//Get inventory summary in excel format
const getInventorySummaryExcel = async (req, res) => {
    try {
        let inventorySummary = await getInventoryReportData();
       
        convertJsonToExcel(inventorySummary,"Inventory Summary", res);

    } catch (error) {
        console.log(error);
    }
}

//Get data for product sales report
const getData4ProductSalesReport = async (fromDate, toDate) => {
    const productSales = [];
    
    let items = await Items.find({})

    for (let item in items) {
        let sales = await getProductSales(fromDate, toDate, items[item].itemID);
        let quantity = 0;
        let amount = 0;
        if (sales.length > 0) {
            quantity = sales[0].quantity;
            amount = sales[0].amount;
        }
        let product = {
            itemID: items[item].itemID,
            itemName: items[item].itemName,
            quantity: quantity,
            amount: amount.toFixed(2)
        }
        productSales.push(product);
    }
    
    return productSales;
}

//Get product sales by items from invoice
const getProductSales = async (fromDate, toDate, itemID) => {
    let sales = await Invoices.aggregate()
        .match({
            invoiceDate: {
                $gte: fromDate,
                $lt: toDate
            },
            status: { $nin: ["Draft", "Void"] }
        })
        .unwind({
            path: "$items",
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: true
        })
        .match({
            "items.itemID": itemID
        })
        .group({
            _id: "$items.itemID",
            quantity: { $sum: "$items.quantity" },
            amount: { $sum: "$items.total" }
        });
    return sales;
}

//Get Product Sales Report in pdf
const getProductSalesReport = async (req, res) => {
    try {
        let fromDate = new Date(req.query.fromDate);
        let toDate = new Date(req.query.toDate);
        toDate.setDate(toDate.getDate() + 1);

        let productSales = await getData4ProductSalesReport(fromDate, toDate);

        let template = productSalesTemplate(productSales, fromDate, toDate);
        
        convertToPdf(template, res);

    } catch (error) {
        console.log(error);
    }
}

//Get Product Sales Report in xlsx
const getProductSalesReportExcel = async (req, res) => {
    try {
        let fromDate = new Date(req.query.fromDate);
        let toDate = new Date(req.query.toDate);
        toDate.setDate(toDate.getDate() + 1);

        let productSales = await getData4ProductSalesReport(fromDate, toDate);
       
        convertJsonToExcel(productSales,"Product Sales Report", res);

    } catch (error) {
        console.log(error);
    }
}

//Get Customer Sales data 
const getCustomerSalesData = async (fromDate, toDate) => {
    const customerSales = [];
    let customers = await Customers.find({})

    for (let cust in customers) {
        let sales = await getCustomerSales(fromDate, toDate, customers[cust].customerID);
        let quantity = 0;
        let amount = 0;
        if (sales.length > 0) {
            quantity = sales[0].quantity;
            amount = sales[0].amount;
        }
        let customer = {
            customerID: customers[cust].customerID,
            customerName: customers[cust].customerName,
            quantity: quantity,
            amount: amount.toFixed(2)
        }
        customerSales.push(customer);
    }
    
    return customerSales;

};

//Get sales by customers from invoice
const getCustomerSales = async (fromDate, toDate, customerID) => {
    let sales = await Invoices.aggregate()
        .match({
            invoiceDate: {
                $gte: fromDate,
                $lt: toDate
            },
            status: { $nin: ["Draft", "Void"] },
            customerID: customerID
        })
        .unwind({
            path: "$items",
            includeArrayIndex: 'string',
            preserveNullAndEmptyArrays: true
        })
        .group({
            _id: "$customerID",
            quantity: { $sum: "$items.quantity" },
            amount: { $sum: "$items.total" }
        });
    
    return sales;
};

//Get Customer Sales Report in pdf
const getCustomerSalesReport = async (req, res) => {
    try {
        let fromDate = new Date(req.query.fromDate);
        let toDate = new Date(req.query.toDate);
        toDate.setDate(toDate.getDate() + 1);

        let customerSales = await getCustomerSalesData(fromDate, toDate);

        let template = customerSalesTemplate(customerSales, fromDate, toDate);
        
        convertToPdf(template, res);

    } catch (error) {
        console.log(error);
    }
}

//Get Product Sales Report in xlsx
const getCustomerSalesReportExcel = async (req, res) => {
    try {
        let fromDate = new Date(req.query.fromDate);
        let toDate = new Date(req.query.toDate);
        toDate.setDate(toDate.getDate() + 1);

        let customerSales = await getCustomerSalesData(fromDate, toDate);
       
        convertJsonToExcel(customerSales,"Customer Sales Report", res);

    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    getInventorySummary,
    getInventorySummaryExcel,
    getProductSalesReport,
    getProductSalesReportExcel,
    getCustomerSalesReport,
    getCustomerSalesReportExcel
}
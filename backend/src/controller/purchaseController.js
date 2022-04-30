const PurchaseOrder = require("../model/PurchaseOrder");
const convertToPdf = require("../helpers/htmltopdf");
const purchaseOrderForm = require("../reports/purchaseOrder");

//Insert Purchase Order
const insertPurchaseOrder = (req, res) => {
    try {
        var item = {
            vendorID: req.body.vendorID,
            orderDate: req.body.orderDate,
            expectedDate: req.body.expectedDate,
            refNo: req.body.refNo,
            items: req.body.items,
            status: req.body.status
        }
        if (item.vendorID !== "" && item.vendorID !== undefined) {
            const purchaseOrder = new PurchaseOrder(item);
            purchaseOrder.save()
                .then(() => {
                    res.json({ status: "Success" });
                })
                .catch((er) => {
                    console.log(er);
                    if (!res.headersSent)
                        res.sendStatus(500).json({ status: "Error" });
                });
        } else {
            res.json({ status: "Error", message: "Invalid inputs" });
        }
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
};

//Update Purchase Order
const updatePurchaseOrder = (req, res) => {
    try {
        const pOID = req.params.id;
        let status = PurchaseOrder.findOne({ purchaseOrderID: pOID }).then(true);
        
        var updateItem = {
            status: req.body.status
        };
        if (status.status === "Draft") {
            updateItem = {
                vendorID: req.body.vendorID,
                orderDate: req.body.orderDate,
                expectedDate: req.body.expectedDate,
                refNo: req.body.refNo,
                items: req.body.items,
                status: req.body.status
            };
        } else {
            if (req.body.status === "Draft")
                return res.json({ status: "Error", message: "Cannot be updated to draft." });
        }
        if (pOID !== "" && pOID !== undefined) {
            PurchaseOrder.findOneAndUpdate({ purchaseOrderID: pOID }, updateItem, null)
                .then(res.json({status: "Success"}))
                .catch((er) => {
                    if (!res.headersSent)
                        res.sendStatus(500).json({ status: "Error" });
                });
        } else {
            res.json({ status: "Error", message: "Invalid inputs" });
        }
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

//Get Purchase Orders
const getPurchaseOrder = async (req, res) => {
    try {
        let OrderID = req.params.id;
        let purchaseOrder = "";
        const lookupQ = {
            from: "vendors",
            localField: "vendorID",
            foreignField: "vendorID",
            as: "vendorDetails"
        };
        
        if (OrderID === "A") {
            purchaseOrder = await PurchaseOrder
                .aggregate()
                .lookup(lookupQ)
                .sort({ orderDate: -1 });
        }else {
            purchaseOrder = await PurchaseOrder
                .aggregate()
                .match({purchaseOrderID: Number(OrderID)})
                .lookup(lookupQ)
                .sort({ orderDate: -1 });
        }
        
        if (purchaseOrder.length > 0) {
            res.json(purchaseOrder);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        console.log(error);
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

//Get purchase order form 
const getPurchaseOrderForm = async (req, res) => {
    try {
        let OrderID = req.params.id;
        const lookupQ = {
            from: "vendors",
            localField: "vendorID",
            foreignField: "vendorID",
            as: "vendorDetails"
        };
        let purchaseOrder = await PurchaseOrder
            .aggregate()
            .match({ purchaseOrderID: Number(OrderID) })
            .lookup(lookupQ)
            .sort({ orderDate: -1 });
        
        if (purchaseOrder.length > 0) {
            const template = purchaseOrderForm(purchaseOrder[0]);
            convertToPdf(template, "PurchaseOrder", res);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        console.log(error);
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}


module.exports = {
    insertPurchaseOrder,
    updatePurchaseOrder,
    getPurchaseOrder,
    getPurchaseOrderForm
};
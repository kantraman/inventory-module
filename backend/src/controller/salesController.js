const SalesOrder = require("../model/SalesOrder");
const Customer = require("../model/Customer");

//Insert Sales Order
const insertSalesOrder = (req, res) => {
    try {
        var item = {
            customerID: req.body.customerID,
            orderDate: req.body.orderDate,
            items: req.body.items,
            status: req.body.status
        }
        if (item.customerID !== "" && item.customerID !== undefined) {
            const salesOrder = new SalesOrder(item);
            salesOrder.save()
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

//Update Sales Order
const updateSalesOrder = (req, res) => {
    try {
        const sID = req.params.id;
        var updateItem = {
            customerID: req.body.customerID,
            orderDate: req.body.orderDate,
            items: req.body.items,
            status: req.body.status
        };
        if (updateItem.customerID !== "" && updateItem.customerID !== undefined && sID !== "") {
            SalesOrder.findOneAndUpdate({ salesOrderID: sID }, updateItem, null)
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

//Get Sales Orders
const getSalesOrder = async (req, res) => {
    try {
        let OrderID = req.params.id;
        let salesOrder = "";
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        
        if (OrderID === "A") {
            salesOrder = await SalesOrder
                .aggregate()
                .lookup(lookupQ)
                .sort({ orderDate: -1 });
        }else {
            salesOrder = await SalesOrder
                .aggregate()
                .match({salesOrderID: Number(OrderID)})
                .lookup(lookupQ)
                .sort({ orderDate: -1 });
        }
        
        if (salesOrder.length > 0) {
            res.json(salesOrder);
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
    insertSalesOrder,
    updateSalesOrder,
    getSalesOrder
};

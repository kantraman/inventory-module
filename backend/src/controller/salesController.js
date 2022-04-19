const SalesOrder = require("../model/SalesOrder");

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
        const salesOrderID = req.params.id;
        var updateItem = {
            customerID: req.body.customerID,
            orderDate: req.body.orderDate,
            items: req.body.items,
            status: req.body.status
        };
        if (updateItem.customerID !== "" && updateItem.customerID !== undefined && salesOrderID !== "") {
            Customer.findOneAndUpdate({ salesOrderID: salesOrderID }, updateItem, null)
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
        let salesOrderID = req.params.id;
        let filter = {
            salesOrderID: salesOrderID
        };
        let projection = {
            _id: 0,
            __v: 0
        };
        if (salesOrderID === "A")
            filter = {};
        let salesOrder = await SalesOrder.find(filter, projection);
        let custDetails = await salesOrder.getCustomerDetails(er => { throw er });
        console.log(custDetails);
        if (salesOrder.length > 0) {
            res.json(salesOrder);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}


module.exports = {
    insertSalesOrder,
    updateSalesOrder,
    getSalesOrder
};

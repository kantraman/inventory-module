const Customer = require("../model/Customer");

//Insert Customer
const insertCustomer = (req, res) => {
    try {
        var item = {
            title: req.body.title,
            customerName: req.body.customerName,
            customerType: req.body.customerType,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            country: req.body.country,
            emailID: req.body.emailID,
            contactNo1: req.body.contactNo1,
            contactNo2: req.body.contactNo2,
            website: req.body.website
        }
        if (item.customerName !== "" && item.customerName !== undefined) {
            const customer = new Customer(item);
            customer.save()
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

//Update customer
const updateCustomer = (req, res) => {
    try {
        const customerId = req.params.id;
        var updateItem = {
            title: req.body.title,
            customerName: req.body.customerName,
            customerType: req.body.customerType,
            addressLine1: req.body.addressLine1,
            addressLine2: req.body.addressLine2,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            country: req.body.country,
            emailID: req.body.emailID,
            contactNo1: req.body.contactNo1,
            contactNo2: req.body.contactNo2,
            website: req.body.website
        };
        if (updateItem.customerName !== "" && updateItem.customerName !== undefined) {
            Customer.findByIdAndUpdate(customerId, updateItem)
                .then((customer) => res.json(customer))
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

//Get Customer Details
const getCustomer = async (req, res) => {
    try {
        let customerID = req.params.id;
        let filter = {
            customerID: customerID
        };
        let projection = {
            _id: 0,
        };
        if (customerID === "A")
            filter = {};
        let customer = await Customer.find(filter, projection);
        if (customer.length > 0) {
            res.json(customer);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

module.exports = {
    insertCustomer,
    updateCustomer,
    getCustomer
}
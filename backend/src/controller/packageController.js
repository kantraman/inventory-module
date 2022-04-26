const Package = require("../model/Package");

//Insert Package
const insertPackage = (req, res) => {
    try {
        var item = {
            packageDate: req.body.packageDate,
            items: req.body.items,
            status: req.body.status,
            customerID: req.body.customerID,
            salesOrderID: req.body.salesOrderID
        }
        if (item.customerID !== "" && item.customerID !== undefined) {
            const package = new Package(item);
            package.save()
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

//Update Package
const updatePackage = (req, res) => {
    try {
        const packageID = req.params.id;
        var updateItem = {
            packageDate: req.body.packageDate,
            items: req.body.items,
            status: req.body.status,
            customerID: req.body.customerID,
            salesOrderID: req.body.salesOrderID
        };
        if (updateItem.customerID !== "" && updateItem.customerID !== undefined && packageID !== "") {
            Package.findOneAndUpdate({ packageID: packageID }, updateItem, null)
                .then(res.json({ status: "Success" }))
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
};

//Get Package details
const getPackage = async (req, res) => {
    try {
        let packageID = req.params.id;
        let packages = "";
        const lookupQ = {
            from: "customers",
            localField: "customerID",
            foreignField: "customerID",
            as: "custDetails"
        };
        
        if (packageID === "A") {
            packages = await Package
                .aggregate()
                .lookup(lookupQ)
                .sort({ packageDate: -1 });
        }else {
            packages = await Package
                .aggregate()
                .match({packageID: Number(packageID)})
                .lookup(lookupQ)
                .sort({ packageDate: -1 });
        }
        if (packages.length > 0) {
            res.json(packages);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

module.exports = {
    insertPackage,
    updatePackage,
    getPackage
}
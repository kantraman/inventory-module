const Items = require("../model/Items");

//Insert Item Group
const insertItem = (req, res) => {
    try {
        console.log(req.body);
        var item = {
            groupID: req.body.groupID,
            groupName: req.body.groupName,
            itemName: req.body.itemName,
            unit: req.body.unit,
            dimensions: req.body.dimensions,
            weight: req.body.weight,
            manufacturer: req.body.manufacturer,
            brand: req.body.brand,
            sellingPrice: req.body.sellingPrice,
            costPrice: req.body.costPrice,
            descr: req.body.descr,
            openingStock: req.body.openingStock,
            reorderPoint: req.body.reorderPoint,
            prefVendor: req.body.prefVendor,
            itemImg: req.file.filename
        }
        
        if (item.groupName !== "" && item.itemName !== "" && item.itemName !== undefined) {
            const items = new Items(item);
            items.save()
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

module.exports = {
    insertItem
};
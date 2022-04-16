const Items = require("../model/Items");

//Insert Item Group
const insertItem = (req, res) => {
    try {
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
//Get details of a specific item
const getItem =  async (req, res) => {
    try {
        let ID = req.params.id;
        let projection = {
            _id: 0,
        };
        let item = await Items.find({itemID: ID}, projection);
        if (item.length > 0) {
            res.json(item);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

//Get details of all items of a specific group
const getAllItems =  async (req, res) => {
    try {
        let ID = req.params.id;
        let projection = {
            _id: 0,
        };
        let item = await Items.find({groupID: ID}, projection);
        if (item.length > 0) {
            res.json(item);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}



module.exports = {
    insertItem,
    getItem,
    getAllItems
};
const ItemGroup = require("../model/ItemGroups");

//Insert Item Group
const insertItemGroup = (req, res) => {
    try {
        var item = {
            groupName: req.body.groupName,
        }
        if (item.groupName !== "" && item.groupName !== undefined) {
            const itemGrp = new ItemGroup(item);
            itemGrp.save()
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

//Get Item Groups
const getItemGroups = async (req, res) => {
    try {
        let projection = {
            _id: 0,
            "Group Name": "$groupName",
            "ID": "$groupID"
        };
        let itemGrp = await ItemGroup.find({}, projection);
        if (itemGrp.length > 0) {
            res.json(itemGrp);
        } else {
            res.json({ status: "Error", message: "No records found" });
        }
        
    } catch (error) {
        if (!res.headersSent)
            res.json({ status: "Error", message: error.message });
    }
}

module.exports = {
    insertItemGroup,
    getItemGroups
};
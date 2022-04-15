const express = require("express");
const path = require("path");
const auth = require("../helpers/auth");
const {
    insertItemGroup,
    getItemGroups
} = require("../controller/itemGrpController");
const {
    insertItem
} = require("../controller/itemController");

const inventoryRouter = express.Router();

var multer = require('multer')

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, path.join(__dirname, "../../public/", "uploads"));
    },
    filename: function (request, file, callback) {
        console.log(file);
        callback(null, Math.random().toString() + Date.now().toString() + "-" + file.originalname);
    }
});

var upload = multer({ storage: storage });


//Item Groups
inventoryRouter.post("/item-group", auth, (req, res) => insertItemGroup(req, res));
inventoryRouter.get("/item-groups", auth, async (req, res) => getItemGroups(req, res));

//Items
inventoryRouter.post("/item", auth, upload.single('itemImg'), (req, res) => insertItem(req, res));



module.exports = inventoryRouter;
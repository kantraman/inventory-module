const express = require("express");
const auth = require("../helpers/auth");
const uploadFile = require("../helpers/uploadFile");
const {
    insertItemGroup,
    getItemGroups
} = require("../controller/itemGrpController");
const {
    insertItem
} = require("../controller/itemController");

const inventoryRouter = express.Router();

//Item Groups
inventoryRouter.post("/item-group", (req, res) => insertItemGroup(req, res));
inventoryRouter.get("/item-groups", async (req, res) => getItemGroups(req, res));

//Items
inventoryRouter.post("/item", uploadFile, (req, res) => insertItem(req, res));



module.exports = inventoryRouter;
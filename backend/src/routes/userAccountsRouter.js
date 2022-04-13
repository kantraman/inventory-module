const express = require("express"); 
const {
    signupAdmin,
    adminLogin
} = require("../controller/userAccountsController");
const accountsRouter = express.Router();


accountsRouter.post("/signup", async (req, res) => {
    signupAdmin(req, res);
});

accountsRouter.post("/login", async (req, res) => {
    adminLogin(req, res);
});


module.exports = accountsRouter;

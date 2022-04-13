const AccountsInfo = require("../model/UserAccounts");
const jwt = require("jsonwebtoken");

//Signup admin if required
const signupAdmin = async (req, res) => {
    try {
        
        var item = {
            uname: req.body.username,
            email: req.body.email,
            password: req.body.password,
            admin: false
        }
        if (item.uname !== "" && item.email !== "" && item.password !== "") {
            user = await AccountsInfo.findOne({ $or: [{ uname: item.uname }, { email: item.email }] });
            if (user) throw new Error("User already exists.");
            const userAccount = new AccountsInfo(item);
            userAccount.save()
                .then(() => res.json({ status: "Success" }))
                .catch((er) => {
                    console.log(er)
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

const adminLogin = async (req, res) => {
    const uname = req.body.username;
    const password = req.body.password;
    try {
        let user = await AccountsInfo.findOne({ uname: uname })
        if (!user) throw new Error("Invalid username or password.");
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) throw new Error("Invalid username or password.");
        const payload = { user: user.uname, admin: user.admin };
        const token = jwt.sign(payload, process.env.JWT_Key, { expiresIn: '30m' });
        res.json({
            token: token
        });
         
    } catch (error) {
        if(!res.headersSent)
            res.json({ status: "Error", message: error.message })
    }
}

module.exports = {
    signupAdmin,
    adminLogin
}
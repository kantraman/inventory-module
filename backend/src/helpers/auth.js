const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers["x-access-token"];
        if (!token)
            return res.status(401).json({ msg: "No authentication token, access denied" });
        try {
            const verified = jwt.verify(token, process.env.JWT_Key);
            if (!verified)
                return res.status(401).json({ msg: "Token verification failed, authorization denied" });
            req.user = verified.user;
            req.admin = verified.admin;
        } catch (err) {
            return res.status(401).json({ msg: "Token verification failed, authorization denied" });
        }
        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
module.exports = auth;
const multer = require("multer");
const path = require("path");
const express = require("express");

const uploadFile = (req, res, next) => {
    try {
        const storage = multer.diskStorage({
            destination: path.join(__dirname, "../public/", "uploads"),
            filename: (req, file, cb) =>{   
                // null as first argument means no error
                cb(null, Date.now() + '-' + file.originalname )  
            }
        })
        let upload = multer({ storage: storage }).single("itemImg");
        next();
        
    } catch (error) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = uploadFile;
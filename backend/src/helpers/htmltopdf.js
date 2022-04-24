const pdf = require("html-pdf");

const convertToPdf = (template, filename, res) => {
    
    const buffer = pdf.create(template, {
        "format": "A4",
        "orientation": "portrait"
    }).toBuffer((err, buffer) => {
        if (err)
            return res.json({ status: "Error", message: err.message })
        res.type('pdf');
        res.end(buffer, 'binary');
    });
 }
  
  module.exports = convertToPdf;
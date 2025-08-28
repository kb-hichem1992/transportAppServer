const fs = require("fs");
const path = require("path");

const filesPath = "";

const displayPDF = (filename, res) => {
  const fs = require('fs');
  const path = require('path');
  
  const filePath = path.join(__dirname, 'pdfs', filename);
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "PDF file not found" });
  }
  
  try {
    const pdfBuffer = fs.readFileSync(filePath);
    console.log("PDF buffer length:", pdfBuffer.length);
    
    // Check if it's a valid PDF by looking for PDF header
    const header = pdfBuffer.toString('ascii', 0, 4);
    console.log("PDF header:", header);
    
    if (header !== '%PDF') {
      console.error("Invalid PDF header:", header);
      return res.status(500).json({ error: "Invalid PDF file generated" });
    }
    
    res.setHeader('Content-Type', 'application/pdf');
    res.send(pdfBuffer);
    
  } catch (error) {
    console.error("Error reading PDF:", error);
    res.status(500).json({ error: "Error processing PDF" });
  }
};

module.exports = displayPDF;



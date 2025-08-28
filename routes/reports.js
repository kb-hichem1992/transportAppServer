const express = require("express");
const path = require("path");
const pdf = require("../report/pdfGenerator");
const displayPDF = require("../utils/displayPDF");

const router = express.Router();

router.get(
  "/report/DIPLOME/:idinn/:idformm/:dateins/:numagr/:groupe",
  (req, res) => {
    var fullUrl = req.protocol + "://" + req.get("host");
    console.log(req.get("host"));
    const idinn = req.params.idinn;
    const idformm = req.params.idformm;

    const dateins =req.params.dateins;
    const numagr = req.params.numagr; 
    const groupe = req.params.groupe;

    pdf.generatepdf(
      idinn,
      idformm,
      dateins,
      numagr,
      groupe,
      fullUrl,
      function (result) {
        // Check if result is an error object
        if (result && result.error) {
          console.error("PDF generation failed:", result.message);
          return res.status(500).json({ 
            error: "PDF generation failed", 
            details: result.message 
          });
        }

        console.log("PDF generation successful, size:", result.length, "bytes");
        
        // Create filename for download (optional)
        const cleanDateins = dateins ? dateins.replace(/T.*$/, '') : '';
        const cleanFilename = `${idinn}${idformm}${cleanDateins}${numagr}${groupe}`.replace(/\s+/g, '');
        
        // Send PDF directly from memory
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', result.length);
        res.setHeader('Content-Disposition', `inline; filename="${cleanFilename}.pdf"`);
        
        // Send the PDF buffer directly
        res.send(result);
      }
    );
  }
);

router.get("/report/EVALUATION/:idin/:dateins", (req, res) => {
  var fullUrl = req.protocol + "://" + req.get("host");

  const idin = req.params.idin;
  const dateins = req.params.dateins;

  pdf.generatepdf2(idin, dateins, fullUrl, function (result) {
    // Check if result is an error object
    if (result && result.error) {
      console.error("Evaluation PDF generation failed:", result.message);
      return res.status(500).json({ 
        error: "Evaluation PDF generation failed", 
        details: result.message 
      });
    }

    console.log("Evaluation PDF generation successful, size:", result.length, "bytes");
    
    // Create filename for download (optional)
    const cleanDateins = dateins ? dateins.replace(/T.*$/, '') : '';
    const cleanFilename = `${idin}${cleanDateins}`.replace(/\s+/g, '');
    
    // Send PDF directly from memory
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', result.length);
    res.setHeader('Content-Disposition', `inline; filename="${cleanFilename}.pdf"`);
    
    // Send the PDF buffer directly
    res.send(result);
  });
});

router.get("/file", (req, res) => {
  displayPDF("test4.pdf", res);
});

module.exports = router;



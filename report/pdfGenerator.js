var pdf = require("pdf-creator-node");

var fs = require("fs");
var path = require("path");
const fetch = require("node-fetch");
const fontkit = require("@pdf-lib/fontkit");
const utf8 = require("utf8");
const PD = require("pdf-lib");
const PDFDocument = PD.PDFDocument;
const StandardFonts = PD.StandardFonts;
const rgb = PD.rgb;
const degrees = PD.degrees;
const data = require("./data.js");
const { convertToDate } = require("../utils/converter.js");

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

function reverseString(str) {
  var splitString = str.split("");

  var reverseArray = splitString.reverse();

  var joinArray = reverseArray.join("");

  return joinArray;
}

function convert(word) {
  var ff = word;
  if (isNaN(Number(ff)) == true) {
    var db = [];
    var fin = [];
    var j = 0,
      ins = 0;
    for (var i = 0; i < ff.length; ++i) {
      if (ff[i] >= "0" && ff[i] <= "9") {
        ins = 1;
        if (db[j] == null) db[j] = i;

        fin[j] = i;
      } else {
        if (ins == 1) {
          j++;
          ins = 0;
        }
      }
    }

    for (var t = 0; t < db.length; ++t) {
      ff = ff.replaceAt(db[t], reverseString(ff.substring(db[t], fin[t] + 1)));
    }
  }
  return ff;
}

async function generatepdf(idin, idform, dateins, numagr, grp, uurl, fn) {

  // Define file paths directly on the file system
  const templatePath = path.join(__dirname, 'fichier', 'vierge.pdf');
  const fontPath = path.join(__dirname, 'fichier', 'Cairo-Regular.ttf');
  
  try {
    // Test if files exist on file system
    console.log(`Testing PDF template at: ${templatePath}`);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template PDF not found at: ${templatePath}`);
    }
    
    const templateStats = fs.statSync(templatePath);
    if (templateStats.size === 0) {
      throw new Error('Template PDF file is empty');
    }
    
    console.log('✅ Template PDF found successfully:', templateStats.size, 'bytes');
    
    // Test font file
    console.log(`Testing font at: ${fontPath}`);
    
    if (!fs.existsSync(fontPath)) {
      throw new Error(`Font file not found at: ${fontPath}`);
    }
    
    const fontStats = fs.statSync(fontPath);
    if (fontStats.size === 0) {
      throw new Error('Font file is empty');
    }
    
    console.log('✅ Font file found successfully:', fontStats.size, 'bytes');
    
  } catch (error) {
    console.error('❌ Resource validation failed:', error.message);
    fn({ error: true, message: error.message });
    return;
  }

data.GetDiplomeData(
  idin,
  idform,
  dateins,
  numagr,
  grp,
  async function (result) {
    try {
      var NomPeren = result[0].NOM_CANDIDAT + " " + result[0].PRENOM_CANDIDAT;

      var DATE_DE = "";
      var DATE_TO = "";
      if (result[0].LIV_BREVET != null) DATE_DE = result[0].LIV_BREVET;
      if (result[0].EXP_BREVET != null) DATE_TO = result[0].EXP_BREVET;

      var adr = result[0].ADRESSE_CANDIDAT;

      var FICH1 = {
        DIRECTION: { text: "الشلف", x: 275, y: 510 },
        SERIE: { text: "", x: 45, y: 510 },
        DIRECTION2: { text: "الشلف", x: 265, y: 243 },
        PERSONNE: {
          text: NomPeren,
          x: 220 - Math.max(0, NomPeren.length - 23) * 5,
          y: 224,
        },
        DATE_NAI: { text: convertToDate(result[0].DATE_NAIS_CANDIDAT), x: 240, y: 205 },
        LIEU_NAI: {
          text: result[0].LIEU_NAIS_CANDIDAT,
          x: 198 - Math.max(0, result[0].LIEU_NAIS_CANDIDAT.length - 8) * 5,
          y: 205,
        },
        ADRESSE: {
          text: convert(adr),
          x: 250 - Math.max(0, result[0].ADRESSE_CANDIDAT.length - 16) * 5,
          y: 186,
        },
        TYPE: { text: result[0].TYPE_FORMATION, x: 205, y: 164 },
        LIEU_EDIT: { text: "الشلف", x: 180, y: 124 },
        DATE_EDIT: { text: "", x: 70, y: 124 },
        Wilaya: { text: "الشلف", x: 115, y: 88 },
      };

      console.log('Reading PDF template from file system...');
      
      // ✅ Read files directly from file system instead of HTTP
      const existingPdfBytes = fs.readFileSync(templatePath);
      console.log('Template PDF loaded:', existingPdfBytes.length, 'bytes');

      const ubuntuFontBytes = fs.readFileSync(fontPath);
      console.log('Font loaded:', ubuntuFontBytes.length, 'bytes');

      // Validate PDF header
      const pdfHeader = existingPdfBytes.toString('ascii', 0, 4);
      if (pdfHeader !== '%PDF') {
        throw new Error(`Invalid PDF header: ${pdfHeader}`);
      }
      console.log('✅ Valid PDF header found');

      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      pdfDoc.registerFontkit(fontkit);

      const helveticaFont = await pdfDoc.embedFont(ubuntuFontBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();

      var F1 = JSON.parse(JSON.stringify(FICH1));

      for (let ob in F1) {
        var textSize = 10;

        if (ob == "TYPE" && F1[ob]["text"].length > 17) textSize = 8;

        var textHeight = helveticaFont.heightAtSize(textSize);

        var textWidth = helveticaFont.widthOfTextAtSize(
          F1[ob]["text"],
          textSize
        );

        firstPage.drawText(F1[ob]["text"], {
          x: F1[ob]["x"],
          y: F1[ob]["y"],
          size: textSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(-360),
        });
      }

      const pdfBytes = await pdfDoc.save();

      console.log('✅ PDF generated successfully in memory');
      // Return the PDF bytes directly instead of saving to file
      fn(Buffer.from(pdfBytes));

    } catch (error) {
      console.error('❌ Error in PDF generation:', error);
      fn({ error: true, message: error.message });
    }
  }
);
}
// async function generatepdf2(idin, dateins, uurl, fn) {
//   data.GetEvaluationData(
//     idin,
//     dateins,

//     async function (result) {
//       /*
//   var FICH1={"NOM":{"text":"اللقب:","x":522,"y":506},
//             "PRENOM":{"text":"الاسم:","x":522,"y":476},
// 			"DATE_NAI":{"text":"تاريخ و مكان الازدياد :","x":435,"y":452},
// 			"ARESSE":{"text":"العنوان:","x":513,"y":428},
// 			"DATE_INS":{"text":"مسجل بتاريخ:","x":482,"y":404},
// 			"NUM_INS":{"text":"تحت رقم:","x":210,"y":404},
// 			"CATEGORIE":{"text":"صنف رخصة السياقة:","x":441,"y":380}
		
//            };

//    */
//       const customFont = await fetch(uurl + "/timesbd.ttf").then((res) =>
//         res.arrayBuffer()
//       );

//       var sz = 8;
//       if (result[0].CATEGORIE_PERMIS.length > 44) sz = 5;

//       var FICH1 = {
//         /*         libelle: {
//           text: "الرقم الوطني :",
//           x: 483,
//           y: 540,
//           font : customFont,
//         }, */
//         NUMERO_NAT: {
//           text: result[0].NUMERO_NAT,
//           x: 400 - Math.max(0, result[0].NUMERO_NAT.length - 8) * 7,
//           y: 530,
//         },
//         NOM: {
//           text: result[0].NOM_CANDIDAT,
//           x: 438 - Math.max(0, result[0].NOM_CANDIDAT.length - 8) * 7,
//           y: 506,
//         },
//         PRENOM: {
//           text: result[0].PRENOM_CANDIDAT,
//           x: 438 - Math.max(0, result[0].PRENOM_CANDIDAT.length - 8) * 7,
//           y: 476,
//         },
//         DATE_NAI: { text: result[0].DATE_NAIS_CANDIDAT, x: 330, y: 452 },
//         LIEU_NAI: {
//           text: result[0].LIEU_NAIS_CANDIDAT,
//           x: 270 - Math.max(0, result[0].LIEU_NAIS_CANDIDAT.length - 8) * 8,
//           y: 452,
//         },
//         ARESSE: {
//           text: convert(result[0].ADRESSE_CANDIDAT),
//           x: 410 - Math.max(0, result[0].ADRESSE_CANDIDAT.length - 10) * 7,
//           y: 428,
//         },
//         DATE_INS: { text: result[0].DATE_INS, x: 369, y: 404 },
//         NUM_INS: {
//           text: result[0].NUM_INS,
//           x: 130 - Math.max(0, result[0].NUM_INS.length - 5) * 7,
//           y: 404,
//         },
//         CATEGORIE_PERMIS: {
//           text: result[0].CATEGORIE_PERMIS,
//           x: 290 - Math.max(0, result[0].CATEGORIE_PERMIS.length - 15) * sz,
//           y: 380,
//         },
//       };

//       const url = uurl + "/eval.pdf";

//       const existingPdfBytes = await fetch(url).then((res) =>
//         res.arrayBuffer()
//       );

//       const ubuntuFontBytes = await fetch(uurl + "/times.ttf").then((res) =>
//         res.arrayBuffer()
//       );

//       const pdfDoc = await PDFDocument.load(existingPdfBytes);

//       pdfDoc.registerFontkit(fontkit);

//       const helveticaFont = await pdfDoc.embedFont(ubuntuFontBytes);
//       const timesbd = await pdfDoc.embedFont(customFont);

//       const pages = pdfDoc.getPages();
//       const firstPage = pages[0];
//       //  const { width, height } = firstPage.getSize();

//       //  console.log(result[0].CATEGORIE_PERMIS.length);

//       var F1 = JSON.parse(JSON.stringify(FICH1));

//       firstPage.drawText("الرقم الوطني :", {
//         x: 483,
//         y: 530,
//         size: 16,
//         font: timesbd,
//       });

//       for (let ob in F1) {
//         var textSize = 16;

//         if (sz == 5) textSize = 12;
//     /*     var textHeight = helveticaFont.heightAtSize(textSize);

//         var textWidth = helveticaFont.widthOfTextAtSize(
//           F1[ob]["text"],
//           textSize
//         ); */

//         firstPage.drawText(F1[ob]["text"], {
//           x: F1[ob]["x"],
//           y: F1[ob]["y"],
//           size: textSize,
//           font: helveticaFont,
//           color: rgb(0, 0, 0),
//           rotate: degrees(-360),
//         });
//       }

//       const pdfBytesToSend = await pdfDoc.saveAsBase64({ dataUri: true });

//       const pdfBytes = await pdfDoc.save();
//       //idin,idPerm, dateins, numagr
//       var filename = "./" + idin + dateins + ".pdf";
//       fs.writeFileSync(filename, pdfBytes);

//       fn(pdfBytesToSend);
//     }
//   );
// }


async function generatepdf2(idin, dateins, uurl, fn) {
  
  // Define file paths directly on the file system
  const evalTemplatePath = path.join(__dirname,'fichier', 'eval.pdf');
  const timesFontPath = path.join(__dirname,'fichier',  'times.ttf');
  const timesBdFontPath = path.join(__dirname,'fichier', 'timesbd.ttf');
  
  try {
    // Test if files exist on file system
    console.log(`Testing eval template at: ${evalTemplatePath}`);
    
    if (!fs.existsSync(evalTemplatePath)) {
      throw new Error(`Eval template PDF not found at: ${evalTemplatePath}`);
    }
    
    const templateStats = fs.statSync(evalTemplatePath);
    if (templateStats.size === 0) {
      throw new Error('Eval template PDF file is empty');
    }
    
    console.log('✅ Eval template PDF found successfully:', templateStats.size, 'bytes');
    
    // Test font files
    if (!fs.existsSync(timesFontPath)) {
      throw new Error(`Times font not found at: ${timesFontPath}`);
    }
    
    if (!fs.existsSync(timesBdFontPath)) {
      throw new Error(`Times Bold font not found at: ${timesBdFontPath}`);
    }
    
    console.log('✅ Font files found successfully');
    
  } catch (error) {
    console.error('❌ Resource validation failed:', error.message);
    fn({ error: true, message: error.message });
    return;
  }

  data.GetEvaluationData(
    idin,
    dateins,
    async function (result) {
      try {
        console.log('Reading font files from file system...');
        
        // ✅ Read files directly from file system instead of HTTP
        const customFont = fs.readFileSync(timesBdFontPath);
        const ubuntuFontBytes = fs.readFileSync(timesFontPath);
        
        console.log('Times Bold font loaded:', customFont.length, 'bytes');
        console.log('Times font loaded:', ubuntuFontBytes.length, 'bytes');

        var sz = 8;
        if (result[0].CATEGORIE_PERMIS.length > 44) sz = 5;

        var FICH1 = {
          NUMERO_NAT: {
            text: result[0].NUMERO_NAT,
            x: 400 - Math.max(0, result[0].NUMERO_NAT.length - 8) * 7,
            y: 530,
          },
          NOM: {
            text: result[0].NOM_CANDIDAT,
            x: 438 - Math.max(0, result[0].NOM_CANDIDAT.length - 8) * 7,
            y: 506,
          },
          PRENOM: {
            text: result[0].PRENOM_CANDIDAT,
            x: 438 - Math.max(0, result[0].PRENOM_CANDIDAT.length - 8) * 7,
            y: 476,
          },
          DATE_NAI: { text: convertToDate(result[0].DATE_NAIS_CANDIDAT), x: 330, y: 452 },
          LIEU_NAI: {
            text: result[0].LIEU_NAIS_CANDIDAT,
            x: 270 - Math.max(0, result[0].LIEU_NAIS_CANDIDAT.length - 8) * 8,
            y: 452,
          },
          ARESSE: {
            text: convert(result[0].ADRESSE_CANDIDAT),
            x: 410 - Math.max(0, result[0].ADRESSE_CANDIDAT.length - 10) * 7,
            y: 428,
          },
          DATE_INS: { text: convertToDate(result[0].DATE_INS), x: 369, y: 404 },
          NUM_INS: {
            text: result[0].NUM_INS,
            x: 130 - Math.max(0, result[0].NUM_INS.length - 5) * 7,
            y: 404,
          },
          CATEGORIE_PERMIS: {
            text: result[0].CATEGORIE_PERMIS,
            x: 290 - Math.max(0, result[0].CATEGORIE_PERMIS.length - 15) * sz,
            y: 380,
          },
        };

        console.log('Reading eval template from file system...');
        
        // ✅ Read template directly from file system instead of HTTP
        const existingPdfBytes = fs.readFileSync(evalTemplatePath);
        console.log('Eval template loaded:', existingPdfBytes.length, 'bytes');

        // Validate PDF header
        const pdfHeader = existingPdfBytes.toString('ascii', 0, 4);
        if (pdfHeader !== '%PDF') {
          throw new Error(`Invalid PDF header: ${pdfHeader}`);
        }
        console.log('✅ Valid PDF header found');

        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        pdfDoc.registerFontkit(fontkit);

        const helveticaFont = await pdfDoc.embedFont(ubuntuFontBytes);
        const timesbd = await pdfDoc.embedFont(customFont);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        var F1 = JSON.parse(JSON.stringify(FICH1));

        firstPage.drawText("الرقم الوطني :", {
          x: 483,
          y: 530,
          size: 16,
          font: timesbd,
        });

        for (let ob in F1) {
          var textSize = 16;

          if (sz == 5) textSize = 12;

          firstPage.drawText(F1[ob]["text"], {
            x: F1[ob]["x"],
            y: F1[ob]["y"],
            size: textSize,
            font: helveticaFont,
            color: rgb(0, 0, 0),
            rotate: degrees(-360),
          });
        }

        const pdfBytes = await pdfDoc.save();

        console.log('✅ Evaluation PDF generated successfully in memory');
        // Return the PDF bytes directly instead of saving to file
        fn(Buffer.from(pdfBytes));

      } catch (error) {
        console.error('❌ Error in evaluation PDF generation:', error);
        fn({ error: true, message: error.message });
      }
    }
  );
}

module.exports = { generatepdf: generatepdf, generatepdf2: generatepdf2 };

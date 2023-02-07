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
  data.GetDiplomeData(
    idin,
    idform,
    dateins,
    numagr,
    grp,
    async function (result) {
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
        DATE_NAI: { text: result[0].DATE_NAIS_CANDIDAT, x: 240, y: 205 },
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
        //	"DE":{"text":DATE_DE,"x":110,"y":164},
        //"TO":{"text":DATE_TO,"x":37,"y":164},
        LIEU_EDIT: { text: "الشلف", x: 180, y: 124 },
        DATE_EDIT: { text: "", x: 70, y: 124 },
        Wilaya: { text: "الشلف", x: 115, y: 88 },
      };

      const url = uurl + "/vierge.pdf";

      const existingPdfBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );

      const ubuntuFontBytes = await fetch(uurl + "/Cairo-Regular.ttf").then(
        (res) => res.arrayBuffer()
      );

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

        /*
      firstPage.drawRectangle({
        x: F1[ob]["x"],
        y: F1[ob]["y"],
        width: textWidth,
        height: 5,
        borderColor: rgb(1, 1, 1),
        borderWidth:  textHeight,
     
      })
     */

        firstPage.drawText(F1[ob]["text"], {
          x: F1[ob]["x"],
          y: F1[ob]["y"],
          size: textSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(-360),
        });
      }

      const pdfBytesToSend = await pdfDoc.saveAsBase64({ dataUri: true });

      const pdfBytes = await pdfDoc.save();
      var fileN = "./" + idin + idform + dateins + numagr + grp + ".pdf";
      fs.writeFileSync(fileN, pdfBytes);

      fn(pdfBytesToSend);
    }
  );
}

async function generatepdf2(idin, dateins, uurl, fn) {
  data.GetEvaluationData(
    idin,
    dateins,

    async function (result) {
      /*
  var FICH1={"NOM":{"text":"اللقب:","x":522,"y":506},
            "PRENOM":{"text":"الاسم:","x":522,"y":476},
			"DATE_NAI":{"text":"تاريخ و مكان الازدياد :","x":435,"y":452},
			"ARESSE":{"text":"العنوان:","x":513,"y":428},
			"DATE_INS":{"text":"مسجل بتاريخ:","x":482,"y":404},
			"NUM_INS":{"text":"تحت رقم:","x":210,"y":404},
			"CATEGORIE":{"text":"صنف رخصة السياقة:","x":441,"y":380}
		
           };

   */
      const customFont = await fetch(uurl + "/timesbd.ttf").then((res) =>
        res.arrayBuffer()
      );

      var sz = 8;
      if (result[0].CATEGORIE_PERMIS.length > 44) sz = 5;

      var FICH1 = {
        /*         libelle: {
          text: "الرقم الوطني :",
          x: 483,
          y: 540,
          font : customFont,
        }, */
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
        DATE_NAI: { text: result[0].DATE_NAIS_CANDIDAT, x: 330, y: 452 },
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
        DATE_INS: { text: result[0].DATE_INS, x: 369, y: 404 },
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

      const url = uurl + "/eval.pdf";

      const existingPdfBytes = await fetch(url).then((res) =>
        res.arrayBuffer()
      );

      const ubuntuFontBytes = await fetch(uurl + "/times.ttf").then((res) =>
        res.arrayBuffer()
      );

      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      pdfDoc.registerFontkit(fontkit);

      const helveticaFont = await pdfDoc.embedFont(ubuntuFontBytes);
      const timesbd = await pdfDoc.embedFont(customFont);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      //  const { width, height } = firstPage.getSize();

      //  console.log(result[0].CATEGORIE_PERMIS.length);

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
    /*     var textHeight = helveticaFont.heightAtSize(textSize);

        var textWidth = helveticaFont.widthOfTextAtSize(
          F1[ob]["text"],
          textSize
        ); */

        firstPage.drawText(F1[ob]["text"], {
          x: F1[ob]["x"],
          y: F1[ob]["y"],
          size: textSize,
          font: helveticaFont,
          color: rgb(0, 0, 0),
          rotate: degrees(-360),
        });
      }

      const pdfBytesToSend = await pdfDoc.saveAsBase64({ dataUri: true });

      const pdfBytes = await pdfDoc.save();
      //idin,idPerm, dateins, numagr
      var filename = "./" + idin + dateins + ".pdf";
      fs.writeFileSync(filename, pdfBytes);

      fn(pdfBytesToSend);
    }
  );
}

module.exports = { generatepdf: generatepdf, generatepdf2: generatepdf2 };

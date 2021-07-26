const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql");
// files 
const fs = require('fs');
const path = require('path');


const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bdd",
  dateStrings: true,
});

module.exports = db;

const pdf = require("./report/pdfGenerator.js");
const filesPath = '';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("report/fichier"));

app.get("/api/getCon", (req, res) => {
  const sqlquery = "SELECT etat FROM connection where id ='1'";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});

app.put("/update_password", (req, res) => {
  const password = req.body.password;
  const username = req.body.username;
  const admin = req.body.admin;
  const numeroAgrement = req.body.numeroAgrement;
  db.query(
    "UPDATE user SET `PASSWORD`= ? WHERE `USERNAME`= ? and `ADMIN`= ? and `NUMERO_AGREMENT`= ?;",
    [
      password,
      username,
      admin,
      numeroAgrement,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values updated");
      }
    }
  );
});

app.get("/api/getOp", (req, res) => {
  const sqlquery = "SELECT * FROM operateur;";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});

app.get("/api/getUser/:username/:password", (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  db.query(
    "SELECT * FROM  user  where USERNAME = ?  and PASSWORD = ?",
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.get("/api/getCentre/:numeroAgrement", (req, res) => {
  const numeroAgrement = req.params.numeroAgrement;
  db.query(
    "SELECT NOM_CENTRE FROM centre where NUMERO_AGREMENT = ?",
    [numeroAgrement],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.get("/api/get_form", (req, res) => {
  const sqlquery =
    "select formation.NUMERO_FORMATION, formation.GROUPE, formation.NUMERO_AGREMENT,formation.TYPE_FORMATION, formation.DEBUT, formation.FIN from formation;";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});
app.get("/api/get_candidat", (req, res) => {
  const sqlquery = "SELECT * FROM candidat;";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});
/* app.get("/api/get_candidat_form", (req, res) => {
  const sqlquery =
    "SELECT passe.NUMERO_FORMATION, candidat.NUM_INS,candidat.NOM_CANDIDAT, candidat.PRENOM_CANDIDAT, candidat.PRENOM_PERE, formation.TYPE_FORMATION, passe.GROUPE, formation.DEBUT, formation.FIN,passe.REMARQUE, passe.NOTE from ((passe inner join candidat on candidat.NUM_INS = passe.NUM_INS) inner join formation on formation.NUMERO_FORMATION = passe.NUMERO_FORMATION) where passe.NUMERO_FORMATION= ?";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
}); */
app.get( "/api/get_candidat_form/:numeroFormation/:numeroAgrement/:groupe",
  (req, res) => {
    const numeroFormation = req.params.numeroFormation;
    const numeroAgrement = req.params.numeroAgrement;
    const groupe = req.params.groupe;
    db.query(
      "SELECT passe.NUMERO_FORMATION, passe.NUMERO_AGREMENT, passe.NUM_PERMIS,passe.DATE_INS, candidat.NUM_INS, candidat.NOM_CANDIDAT, candidat.PRENOM_CANDIDAT, candidat.PRENOM_PERE, formation.TYPE_FORMATION, passe.GROUPE, formation.DEBUT, formation.FIN,passe.REMARQUE, passe.NOTE, passe.BREVET from ((passe inner join candidat on candidat.NUM_INS = passe.NUM_INS and candidat.NUM_PERMIS = passe.NUM_PERMIS ) inner join formation on formation.NUMERO_FORMATION = passe.NUMERO_FORMATION and formation.NUMERO_AGREMENT = passe.NUMERO_AGREMENT and formation.GROUPE = passe.GROUPE ) where passe.NUMERO_FORMATION= ? and passe.NUMERO_AGREMENT= ? and passe.GROUPE = ?",
      [numeroFormation, numeroAgrement, groupe],
      (err, result) => {
        res.send(result);
      }
    );
  }
);
app.put("/update_passe", (req, res) => {
  const remarque = req.body.remarque;
  const note = req.body.note;
  const numeroCandidat = req.body.numeroCandidat;
  const numeroFormation = req.body.numeroFormation;
  const GROUPE = req.body.GROUPE;
  const numeroAgrement = req.body.numeroAgrement;
  const Num_permis = req.body.Num_permis;
  const dateins = req.body.dateins;
  db.query(
    "UPDATE passe SET `REMARQUE`= ?, `NOTE`= ?  WHERE `NUM_INS`= ? and NUM_PERMIS = ? and DATE_INS = ? and `NUMERO_FORMATION`= ? and `GROUPE`= ? and `NUMERO_AGREMENT` = ?  ;",
    [
      remarque,
      note,
      numeroCandidat,
      Num_permis,
      dateins,
      numeroFormation,
      GROUPE,
      numeroAgrement,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values updated");
      }
    }
  );
});
app.put("/Printed", (req, res) => {
  const numeroCandidat = req.body.numeroCandidat;
  const numeroFormation = req.body.numeroFormation;
  const GROUPE = req.body.GROUPE;
  const numeroAgrement = req.body.numeroAgrement;
  const Num_permis = req.body.Num_permis;
  const dateins = req.body.dateins;
  db.query(
    "UPDATE passe SET `PRINT`= 1 WHERE `NUM_INS`= ? and NUM_PERMIS = ? and DATE_INS = ? and `NUMERO_FORMATION`= ? and `GROUPE`= ? and `NUMERO_AGREMENT` = ?  ;",
    [
      numeroCandidat,
      Num_permis,
      dateins,
      numeroFormation,
      GROUPE,
      numeroAgrement,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values updated");
      }
    }
  );
});
app.get("/api/get_brevet", (req, res) => {
  const sqlquery =
    "SELECT passe.PRINT, passe.BREVET, candidat.NOM_CANDIDAT, candidat.PRENOM_CANDIDAT, candidat.PRENOM_PERE, passe.LIV_BREVET, passe.EXP_BREVET, formation.TYPE_FORMATION, passe.GROUPE,passe.NUMERO_FORMATION, passe.NUM_INS, passe.NUM_PERMIS, passe.DATE_INS, passe.NUMERO_AGREMENT, passe.GROUPE FROM ((passe INNER JOIN candidat ON candidat.NUM_INS = passe.NUM_INS AND candidat.DATE_INS = passe.DATE_INS AND candidat.NUM_PERMIS = passe.NUM_PERMIS) INNER JOIN formation ON formation.NUMERO_FORMATION = passe.NUMERO_FORMATION  AND formation.NUMERO_AGREMENT = passe.NUMERO_AGREMENT AND formation.GROUPE = passe.GROUPE) where passe.BREVET != '';";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});
app.get("/api/get_passe", (req, res) => {
  const sqlquery = "SELECT * FROM passe";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});
app.put("/insert_brevet", (req, res) => {
  const NumeroBrevet = req.body.NumeroBrevet;
  const LivBrevet = req.body.LivBrevet;
  const ExpBrevet = req.body.ExpBrevet;
  const numeroCandidat = req.body.numeroCandidat;
  const Date_ins = req.body.Date_ins;
  const Num_permis = req.body.Num_permis;
  const numeroFormation = req.body.numeroFormation;
  const numeroAgrement = req.body.numeroAgrement;
  const GROUPE = req.body.GROUPE;

  db.query(
    "UPDATE passe SET `BREVET`= ?, `LIV_BREVET`= ? , `EXP_BREVET` = ? WHERE `NUM_INS`= ? and `DATE_INS` = ? and `NUM_PERMIS` =? and `NUMERO_FORMATION`= ? and `NUMERO_AGREMENT`= ? and `GROUPE`= ? ;",
    [
      NumeroBrevet,
      LivBrevet,
      ExpBrevet,
      numeroCandidat,
      Date_ins,
      Num_permis,
      numeroFormation,
      numeroAgrement,
      GROUPE,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values updated");
      }
    }
  );
});
app.get("/api/get_veh_Mar", (req, res) => {
  const sqlquery =
    "select vehicule.IMMATRECULATION, vehicule.MARQUE, vehicule.PTC, vehicule.PTAC, vehicule.CU  , operateur.NOM_OPERATEUR, operateur.PRENOM_OPERATEUR, operateur.PRENOM_PERE  from vehicule, operateur where vehicule.GENRE = 'Marchandise' and vehicule.NUMERO_OPERATEUR = operateur.NUMERO_OPERATEUR;";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});
app.get("/api/get_veh_voyag", (req, res) => {
  const sqlquery =
    "select vehicule.IMMATRECULATION, vehicule.MARQUE,vehicule.NOMBRE_PLACE, operateur.NOM_OPERATEUR, operateur.PRENOM_OPERATEUR, operateur.PRENOM_PERE  from vehicule, operateur where vehicule.GENRE = 'Voyageur' and vehicule.NUMERO_OPERATEUR = operateur.NUMERO_OPERATEUR;";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});
app.post("/Add_condidat", (req, res) => {
  const numeroCandidat = req.body.numeroCandidat;
  const Date_ins = req.body.Date_ins;
  const Nom = req.body.Nom;
  const Prénom = req.body.Prénom;
  const Date_naissance = req.body.Date_naissance;
  const Lieu_naissance = req.body.Lieu_naissance;
  const Niveau = req.body.Niveau;
  const Adresse = req.body.Adresse;
  const Prénom_Pére = req.body.Prénom_Pére;
  const Sexe = req.body.Sexe;
  const Type_Candidat = req.body.Type_Candidat;
  const Num_permis = req.body.Num_permis;
  const date_liv = req.body.date_liv;
  const date_exp = req.body.date_exp;
  const type_permis = req.body.type_permis;
  const categorie_permis = req.body.categorie_permis;

  db.query(
    "INSERT INTO candidat (`NUM_INS`, `DATE_INS`,`NOM_CANDIDAT`, `PRENOM_CANDIDAT`, `DATE_NAIS_CANDIDAT`, `LIEU_NAIS_CANDIDAT`, `NIVEAU_SCOL_CANDIDAT`, `ADRESSE_CANDIDAT`, `PRENOM_PERE`, `SEX_CONDIDAT`,`TYPE_CANDIDAT`,`NUM_PERMIS`, `DATE_LIV_PERMIS`, `DATE_EXP_PERMIS`, `TYPE_PERMIS`, `CATEGORIE_PERMIS`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      numeroCandidat,
      Date_ins,
      Nom,
      Prénom,
      Date_naissance,
      Lieu_naissance,
      Niveau,
      Adresse,
      Prénom_Pére,
      Sexe,
      Type_Candidat,
      Num_permis,
      date_liv,
      date_exp,
      type_permis,
      categorie_permis,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.put("/update_candidat", (req, res) => {
  const numeroCandidat = req.body.numeroCandidat;
  const Date_ins = req.body.Date_ins;
  const Nom = req.body.Nom;
  const Prénom = req.body.Prénom;
  const Date_naissance = req.body.Date_naissance;
  const Lieu_naissance = req.body.Lieu_naissance;
  const Niveau = req.body.Niveau;
  const Adresse = req.body.Adresse;
  const Prénom_Pére = req.body.Prénom_Pére;
  const Sexe = req.body.Sexe;
  const Type_Candidat = req.body.Type_Candidat;
  const Num_permis = req.body.Num_permis;
  const date_liv = req.body.date_liv;
  const date_exp = req.body.date_exp;
  const type_permis = req.body.type_permis;
  const categorie_permis = req.body.categorie_permis;
  const newDate_ins = req.body.newDate_ins;
  db.query(
    "UPDATE candidat SET `NOM_CANDIDAT`=?, `PRENOM_CANDIDAT`= ?, `DATE_NAIS_CANDIDAT`=? , `LIEU_NAIS_CANDIDAT`= ?, `NIVEAU_SCOL_CANDIDAT`= ?, `ADRESSE_CANDIDAT`= ?, `PRENOM_PERE`= ?, `SEX_CONDIDAT` = ?, `TYPE_CANDIDAT`= ?,`DATE_LIV_PERMIS` = ?, `DATE_EXP_PERMIS` = ?, `CATEGORIE_PERMIS` = ?, `TYPE_PERMIS` = ?, `DATE_INS` = ?   WHERE  `NUM_PERMIS` = ? and `DATE_INS` = ? and `NUM_INS` = ? ;",
    [
      Nom,
      Prénom,
      Date_naissance,
      Lieu_naissance,
      Niveau,
      Adresse,
      Prénom_Pére,
      Sexe,
      Type_Candidat,
      date_liv,
      date_exp,
      categorie_permis,get
      type_permis,
      newDate_ins,
      Num_permis,
      Date_ins,
      numeroCandidat,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.post("/delete_candidat", (req, res) => {
  const Num_permis = req.body.Num_permis;
  const Date_ins = req.body.Date_ins;
  const numeroCandidat = req.body.numeroCandidat;
  db.query(
    "delete from candidat where `NUM_PERMIS` = ? and `DATE_INS` = ? and NUM_INS = ? ",
    [Num_permis, Date_ins, numeroCandidat],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});
app.post("/Add_formation", (req, res) => {
  const numeroFormation = req.body.numeroFormation;
  const numeroAgrement = req.body.numeroAgrement;
  const groupe = req.body.groupe;
  const Type = req.body.Type;
  const Debut = req.body.Debut;
  const Fin = req.body.Fin;
  db.query(
    "INSERT INTO formation (`NUMERO_FORMATION`, `NUMERO_AGREMENT` , `GROUPE` ,`TYPE_FORMATION`, `DEBUT`, `FIN`) VALUES (?,?,?,?,?,?)",
    [numeroFormation, numeroAgrement, groupe, Type, Debut, Fin],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.put("/update_formation", (req, res) => {
  const Type = req.body.Type;
  const Debut = req.body.Debut;
  const Fin = req.body.Fin;
  const numeroFormation = req.body.numeroFormation;
  const numeroAgrement = req.body.numeroAgrement;
  const groupe = req.body.groupe;
  db.query(
    "UPDATE formation SET `TYPE_FORMATION`= ?, `DEBUT`= ?, `FIN`= ? WHERE `NUMERO_FORMATION`=? and `NUMERO_AGREMENT` = ? and `GROUPE`= ?;",
    [Type, Debut, Fin, numeroFormation, numeroAgrement, groupe],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values updated");
      }
    }
  );
});

app.delete(
  "/delete_formation/:numeroFormation/:numeroAgrement/:groupe",
  (req, res) => {
    const numeroFormation = req.params.numeroFormation;
    const numeroAgrement = req.params.numeroAgrement;
    const groupe = req.params.groupe;
    db.query(
      "delete from formation where NUMERO_FORMATION = ? and NUMERO_AGREMENT = ? and GROUPE = ?",
      [numeroFormation, numeroAgrement, groupe],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }
);
app.post( "/delete_passe",
  (req, res) => {
    const numeroCandidat = req.body.numeroCandidat;
    const Date_ins = req.body.Date_ins;
    const Num_permis = req.body.Num_permis;
    const numeroFormation = req.body.numeroFormation;
    const groupe = req.body.groupe;
    const numeroAgrement = req.body.numeroAgrement;
    db.query(
      "DELETE FROM passe WHERE `NUM_INS`= ? and `DATE_INS`= ? and `NUM_PERMIS`= ? and `NUMERO_FORMATION`= ? and`GROUPE`= ? and`NUMERO_AGREMENT`= ?;",
      [numeroCandidat,Date_ins,Num_permis,numeroFormation,groupe, numeroAgrement],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      }
    );
  }
);

// DIPLOME GENERATION BY ID_INSC ID_FORMATION  ID_PERMIS DATE_INS NUM_AGR FROM PASSE TABLE
app.get(
  "/report/DIPLOME/:idinn/:idformm/:idperm/:dateins/:numagr/:groupe",
  (req, res) => {
    var fullUrl = req.protocol + "://" + req.get("host");
    const idinn = req.params.idinn;
    const idformm = req.params.idformm;
    const idperm = req.params.idperm;
    const dateins = req.params.dateins;
    const numagr = req.params.numagr;
    const groupe=req.params.groupe;

    pdf.generatepdf(
      idinn,
      idformm,
      idperm,
      dateins,
      numagr,
      groupe,
      fullUrl,
      function (dt) {
        //console.log(dt);
         var filen=idinn+idformm+idperm+dateins+numagr+groupe+".pdf";
       displayPDF(filen , res)
      }
    );
  }
);

// EVALUATION GENERATION BY ID_INSC ID_FORMATION  ID_PERMIS DATE_INS NUM_AGR FROM PASSE TABLE
app.get(
  "/report/EVALUATION/:idin/:idperm/:dateins",
  (req, res) => {
    var fullUrl = req.protocol + "://" + req.get("host");

    const idin = req.params.idin;
    
    const idperm = req.params.idperm;
    const dateins = req.params.dateins;
    

    pdf.generatepdf2(
      idin,
      idperm,
      dateins,
      fullUrl,
      function (dt) {
        //console.log(dt);
        var filen=idin+idperm+dateins+".pdf";
        displayPDF(filen , res)
      }
    );
  }
);

app.post("/Add_passe", (req, res) => {
  const numeroCandidat = req.body.numeroCandidat;
  const Date_ins = req.body.Date_ins;
  const Num_permis = req.body.Num_permis;
  const numeroFormation = req.body.numeroFormation;
  const numeroAgrement = req.body.numeroAgrement;
  const remarque = req.body.remarque;
  const note = req.body.note;
  const groupe = req.body.groupe;
  const NumeroBrevet = req.body.NumeroBrevet;
  const LivBrevet = req.body.LivBrevet;
  const ExpBrevet = req.body.ExpBrevet;
  db.query(
    "INSERT INTO passe  (`NUM_INS`, `DATE_INS`, `NUM_PERMIS`, `NUMERO_FORMATION`, `NUMERO_AGREMENT` , `NOTE`, `REMARQUE`, `BREVET`, `LIV_BREVET`, `EXP_BREVET`, `GROUPE`) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    [
      numeroCandidat,
      Date_ins,
      Num_permis,
      numeroFormation,
      numeroAgrement,
      note,
      remarque,
      NumeroBrevet,
      LivBrevet,
      ExpBrevet,
      groupe,
    ],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

app.post("/add_travail", (req, res) => {
  const numeroCandidat = req.body.numeroCandidat;
  const Date_ins = req.body.Date_ins;
  const Num_permis = req.body.Num_permis;
  const Nom_OP = req.body.Nom_OP;
  db.query(
    "INSERT INTO `travail` (`NUM_INS`, `DATE_INS`, `NUM_PERMIS`, `NOM_OP`) VALUES (?,?,?,?)",
    [numeroCandidat, Date_ins, Num_permis, Nom_OP],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values Inserted");
      }
    }
  );
});

//show  pdf file  in browser 
app.get("/file" ,  (req,res)=>{
  displayPDF("test4.pdf",res) ; 
}); 

app.listen(3001, () => {
  console.log("it works");
});


const displayPDF = (filename  , res) => {
  const inputPath = path.resolve(__dirname, filesPath, filename);
  

  fs.readFile(inputPath, function (err, data) {
    if (err) {
      res.statusCode = 500;
      res.end(`Error getting the file: ${err}.`);
    } else {
      const ext = path.parse(inputPath).ext;
      res.setHeader('Content-type','application/pdf');
      res.end(data);
    }
  });
};


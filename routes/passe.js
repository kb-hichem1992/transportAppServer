const express = require("express");
const db = require("../db");
const { convertToDate } = require("../utils/converter");
const router = express.Router();

router.get(
  "/api/get_candidat_form/:numeroFormation/:numeroAgrement/:groupe",
  (req, res) => {
    const numeroFormation = req.params.numeroFormation;
    const numeroAgrement = req.params.numeroAgrement;
    const groupe = req.params.groupe;
    db.query(
      "SELECT passe.NUMERO, passe.NUMERO_FORMATION, passe.NUMERO_AGREMENT, passe.NUM_PERMIS, formation.TYPE_GROUPE, passe.DATE_INS, candidat.NUM_INS, candidat.NOM_CANDIDAT, candidat.PRENOM_CANDIDAT, candidat.PRENOM_PERE, candidat.CATEGORIE_PERMIS,candidat.ADRESSE_CANDIDAT, candidat.DATE_NAIS_CANDIDAT, candidat.LIEU_NAIS_CANDIDAT, candidat.DATE_LIV_PERMIS, formation.TYPE_FORMATION, passe.GROUPE, formation.DEBUT, formation.FIN,passe.REMARQUE, passe.NOTE, passe.BREVET, passe.PRINT from ((passe inner join candidat on candidat.NUM_INS = passe.NUM_INS and candidat.NUM_PERMIS = passe.NUM_PERMIS ) inner join formation on formation.NUMERO_FORMATION = passe.NUMERO_FORMATION and formation.NUMERO_AGREMENT = passe.NUMERO_AGREMENT and formation.GROUPE = passe.GROUPE) where passe.NUMERO_FORMATION = ? and passe.NUMERO_AGREMENT = ? and passe.GROUPE = ?",
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

router.put("/update_groupe_number", (req, res) => {
  const number = req.body.number;
  const numeroCandidat = req.body.numeroCandidat;
  const numeroFormation = req.body.numeroFormation;
  const GROUPE = req.body.GROUPE;
  const numeroAgrement = req.body.numeroAgrement;
  const Num_permis = req.body.Num_permis;
  const dateins = convertToDate(req.body.dateins);

  db.query(
    "UPDATE passe SET `NUMERO`= ? WHERE `NUM_INS`= ? and NUM_PERMIS = ? and DATE_INS = ? and `NUMERO_FORMATION`= ? and `GROUPE`= ? and `NUMERO_AGREMENT` = ? ;",
    [
      number,
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
        res.send("updated");
      }
    }
  );
});

router.put("/update_passe", (req, res) => {
  const remarque = req.body.remarque;
  const note = req.body.note;
  const numeroCandidat = req.body.numeroCandidat;
  const numeroFormation = req.body.numeroFormation;
  const GROUPE = req.body.GROUPE;
  const numeroAgrement = req.body.numeroAgrement;
  const Num_permis = req.body.Num_permis;
  const dateins = convertToDate(req.body.dateins);

  db.query(
    "UPDATE passe SET `REMARQUE`= ?, `NOTE`= ?  WHERE `NUM_INS`= ? and NUM_PERMIS = ? and DATE_INS = ? and `NUMERO_FORMATION`= ? and `GROUPE`= ? and `NUMERO_AGREMENT` = ?;",
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
        res.send("updated");
      }
    }
  );
});

router.put("/Printed", (req, res) => {
  const numeroCandidat = req.body.numeroCandidat;
  const numeroFormation = req.body.numeroFormation;
  const GROUPE = req.body.GROUPE;
  const numeroAgrement = req.body.numeroAgrement;
  const Num_permis = req.body.Num_permis;
  const dateins = convertToDate(req.body.dateins);

  db.query(
    "UPDATE passe SET `PRINT`= 1 WHERE `NUM_INS`= ? and NUM_PERMIS = ? and DATE_INS = ? and `NUMERO_FORMATION`= ? and `GROUPE`= ? and `NUMERO_AGREMENT` = ?;",
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
        res.send(result);
      }
    }
  );
});

router.get("/api/get_brevet/:numeroAgrement", (req, res) => {
  const numeroAgrement = req.params.numeroAgrement;
  const sqlquery =
    "SELECT passe.PRINT, passe.BREVET, candidat.NOM_CANDIDAT, candidat.PRENOM_CANDIDAT,candidat.RESTE, passe.DATE_EMISSION, passe.LIV_BREVET, passe.EXP_BREVET, formation.TYPE_FORMATION, passe.GROUPE,passe.NUMERO_FORMATION, passe.NUM_INS, passe.NUM_PERMIS, passe.DATE_INS, passe.NUMERO_AGREMENT, passe.GROUPE FROM ((passe INNER JOIN candidat ON candidat.NUM_INS = passe.NUM_INS AND candidat.DATE_INS = passe.DATE_INS AND candidat.NUM_PERMIS = passe.NUM_PERMIS) INNER JOIN formation ON formation.NUMERO_FORMATION = passe.NUMERO_FORMATION  AND formation.NUMERO_AGREMENT = passe.NUMERO_AGREMENT AND formation.GROUPE = passe.GROUPE) where passe.NUMERO_AGREMENT = ? and passe.BREVET != '';";
  db.query(sqlquery, [numeroAgrement], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/api/Passing_List/:numeroAgrement/:createur", (req, res) => {
  const numeroAgrement = req.params.numeroAgrement;
  const createur = req.params.createur;
  const sqlquery =
    "SELECT passe.NOTE, passe.REMARQUE ,passe.NUMERO_AGREMENT,candidat.DATE_NAIS_CANDIDAT,candidat.createur, passe.BREVET, candidat.NOM_CANDIDAT, candidat.PRENOM_CANDIDAT, candidat.PRENOM_PERE, passe.LIV_BREVET, passe.EXP_BREVET, formation.TYPE_FORMATION, passe.GROUPE,passe.NUMERO_FORMATION, passe.NUM_INS, passe.NUM_PERMIS, passe.DATE_INS, passe.NUMERO_AGREMENT, passe.GROUPE FROM ((passe INNER JOIN candidat ON candidat.NUM_INS = passe.NUM_INS AND candidat.DATE_INS = passe.DATE_INS AND candidat.NUM_PERMIS = passe.NUM_PERMIS) INNER JOIN formation ON formation.NUMERO_FORMATION = passe.NUMERO_FORMATION  AND formation.NUMERO_AGREMENT = passe.NUMERO_AGREMENT AND formation.GROUPE = passe.GROUPE) where passe.NUMERO_AGREMENT = ? and candidat.createur = ?;";
  db.query(sqlquery, [numeroAgrement, createur], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/api/Passing_List/:numeroAgrement", (req, res) => {
  const numeroAgrement = req.params.numeroAgrement;
  const sqlquery =
    "SELECT passe.NOTE, passe.REMARQUE ,passe.NUMERO_AGREMENT,candidat.DATE_NAIS_CANDIDAT,candidat.createur, passe.BREVET, candidat.NOM_CANDIDAT, candidat.PRENOM_CANDIDAT, candidat.PRENOM_PERE, passe.LIV_BREVET, passe.EXP_BREVET, formation.TYPE_FORMATION, passe.GROUPE,passe.NUMERO_FORMATION, passe.NUM_INS, passe.NUM_PERMIS, passe.DATE_INS, passe.NUMERO_AGREMENT, passe.GROUPE FROM ((passe INNER JOIN candidat ON candidat.NUM_INS = passe.NUM_INS AND candidat.DATE_INS = passe.DATE_INS AND candidat.NUM_PERMIS = passe.NUM_PERMIS) INNER JOIN formation ON formation.NUMERO_FORMATION = passe.NUMERO_FORMATION  AND formation.NUMERO_AGREMENT = passe.NUMERO_AGREMENT AND formation.GROUPE = passe.GROUPE) where passe.NUMERO_AGREMENT = ?;";
  db.query(sqlquery, [numeroAgrement], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/api/Passing_List", (req, res) => {
  const sqlquery =
    "SELECT passe.NOTE, passe.NUMERO_AGREMENT, passe.REMARQUE ,candidat.DATE_NAIS_CANDIDAT,passe.BREVET, candidat.NOM_CANDIDAT, candidat.PRENOM_CANDIDAT, candidat.PRENOM_PERE, passe.LIV_BREVET, passe.EXP_BREVET, formation.TYPE_FORMATION, passe.GROUPE,passe.NUMERO_FORMATION, passe.NUM_INS, passe.NUM_PERMIS, passe.DATE_INS, passe.NUMERO_AGREMENT, passe.GROUPE FROM ((passe INNER JOIN candidat ON candidat.NUM_INS = passe.NUM_INS AND candidat.DATE_INS = passe.DATE_INS AND candidat.NUM_PERMIS = passe.NUM_PERMIS) INNER JOIN formation ON formation.NUMERO_FORMATION = passe.NUMERO_FORMATION  AND formation.NUMERO_AGREMENT = passe.NUMERO_AGREMENT AND formation.GROUPE = passe.GROUPE and passe.NUMERO_AGREMENT != '000');";
  db.query(sqlquery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.put("/insert_brevet", (req, res) => {
  const NumeroBrevet = req.body.NumeroBrevet;
  const numeroCandidat = req.body.numeroCandidat;
  const Date_ins = convertToDate(req.body.Date_ins);
  const Num_permis = req.body.Num_permis;
  const numeroFormation = req.body.numeroFormation;
  const numeroAgrement = req.body.numeroAgrement;
  const GROUPE = req.body.GROUPE;

  db.query(
    "UPDATE passe SET `BREVET`= ? WHERE `NUM_INS`= ? and `DATE_INS` = ? and `NUM_PERMIS` =? and `NUMERO_FORMATION`= ? and `NUMERO_AGREMENT`= ? and `GROUPE`= ? ;",
    [
      NumeroBrevet,
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
        res.send(result);
      }
    }
  );
});

router.put("/insert_Date_brevet", (req, res) => {
  const NumeroBrevet = req.body.NumeroBrevet;
  const numeroCandidat = req.body.numeroCandidat;
  const Date_ins =convertToDate(req.body.Date_ins);
  const Num_permis = req.body.Num_permis;
  const numeroFormation = req.body.numeroFormation;
  const numeroAgrement = req.body.numeroAgrement;
  const GROUPE = req.body.GROUPE;
  const LivBrevt = req.body.LivBrevt;
  const ExpBrevet = req.body.ExpBrevet;
  const Emission = req.body.Emission;

  db.query(
    "UPDATE passe SET LIV_BREVET = ?, EXP_BREVET= ?, DATE_EMISSION = ? WHERE `NUM_INS`= ? and `DATE_INS` = ? and `NUM_PERMIS` =? and `NUMERO_FORMATION`= ? and `NUMERO_AGREMENT`= ? and `GROUPE`= ?  and BREVET =?;",
    [
      LivBrevt,
      ExpBrevet,
      Emission,
      numeroCandidat,
      Date_ins,
      Num_permis,
      numeroFormation,
      numeroAgrement,
      GROUPE,
      NumeroBrevet,
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

router.post("/Add_passe", (req, res) => {
  const numeroCandidat = req.body.numeroCandidat;
  const Date_ins =convertToDate(req.body.Date_ins);
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

router.post("/delete_passe", (req, res) => {
  const numeroCandidat = req.body.numeroCandidat;
  const Date_ins =convertToDate(req.body.Date_ins);
  const Num_permis = req.body.Num_permis;
  const numeroFormation = req.body.numeroFormation;
  const groupe = req.body.groupe;
  const numeroAgrement = req.body.numeroAgrement;
  db.query(
    "DELETE FROM passe WHERE `NUM_INS`= ? and `DATE_INS`= ? and `NUM_PERMIS`= ? and `NUMERO_FORMATION`= ? and`GROUPE`= ? and`NUMERO_AGREMENT`= ?;",
    [
      numeroCandidat,
      Date_ins,
      Num_permis,
      numeroFormation,
      groupe,
      numeroAgrement,
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

module.exports = router;



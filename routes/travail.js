const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/add_travail", (req, res) => {
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

router.get("/get_travail_etat", (req, res) => {
  const num_ins = req.body.NUM_INS;
  const date_ins = req.body.DATE_INS;
  const num_permis = req.body.NUM_PERMIS;

  const sqlquery =
    "SELECT * FROM travail where NUM_INS = ? and DATE_INS = ? and NUM_PERMIS = ? and ETAT = 'affilé' ;";
  db.query(sqlquery, [num_ins, date_ins, num_permis], (err, result) => {
    if (result.length > 0) {
      res.send({ message: "هذا المترشح يعمل عند متعامل أخر" });
    }
  });
});

router.post("/Add_travail", (req, res) => {
  const NUMERO_ENREGISTREMENT = req.body.numeroEnregistrement;
  const NUM_INS = req.body.NUM_INS;
  const DATE_INS = req.body.DATE_INS;
  const NUM_PERMIS = req.body.NUM_PERMIS;
  const DATE_RECRUTEMENT = req.body.DATE_RECRUTEMENT;
  const DATE_FIN = req.body.DATE_FIN;
  const ETAT = req.body.ETAT;

  db.query(
    "INSERT INTO travail (`NUMERO_ENREGISTREMENT`, `NUM_INS`, `DATE_INS`, `NUM_PERMIS`, `DATE_RECRUT`, `DATE_FIN`, `ETAT`) VALUES (?, ?, ?, ?, ?, ?,?);",
    [
      NUMERO_ENREGISTREMENT,
      NUM_INS,
      DATE_INS,
      NUM_PERMIS,
      DATE_RECRUTEMENT,
      DATE_FIN,
      ETAT,
    ],
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send("inserted");
      }
    }
  );
});

router.put("/Update_travail", (req, res) => {
  const NUMERO_ENREGISTREMENT = req.body.numeroEnregistrement;
  const NUM_INS = req.body.NUM_INS;
  const DATE_INS = req.body.DATE_INS;
  const NUM_PERMIS = req.body.NUM_PERMIS;
  const DATE_RECRUTEMENT = req.body.DATE_RECRUTEMENT;
  const DATE_FIN = req.body.DATE_FIN;
  const ETAT = req.body.ETAT;

  db.query(
    "UPDATE travail SET `DATE_FIN` =  ?, `ETAT` = ? WHERE (`NUMERO_ENREGISTREMENT` = ?) and (`NUM_INS` = ?) and (`DATE_INS` = ?) and (`NUM_PERMIS` = ?) and (`DATE_RECRUT` = ?);",
    [
      DATE_FIN,
      ETAT,
      NUMERO_ENREGISTREMENT,
      NUM_INS,
      DATE_INS,
      NUM_PERMIS,
      DATE_RECRUTEMENT,
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

router.post("/delete_travail", (req, res) => {
  const NUMERO_ENREGISTREMENT = req.body.numeroEnregistrement;
  const NUM_INS = req.body.NUM_INS;
  const DATE_INS = req.body.DATE_INS;
  const NUM_PERMIS = req.body.NUM_PERMIS;
  const DATE_RECRUTEMENT = req.body.DATE_RECRUTEMENT;
  db.query(
    "DELETE FROM `travail`  WHERE (`NUMERO_ENREGISTREMENT` = ?) and (`NUM_INS` = ?) and (`DATE_INS` = ?) and (`NUM_PERMIS` = ?) and (`DATE_RECRUT` = ?);",
    [NUMERO_ENREGISTREMENT, NUM_INS, DATE_INS, NUM_PERMIS, DATE_RECRUTEMENT],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("deleted");
      }
    }
  );
});

router.get(
  "/api/get_candidat_foreach_operateur/:NUMERO_ENREGISTREMENT",
  (req, res) => {
    const numeroEnregistrement = req.params.NUMERO_ENREGISTREMENT;
    const sqlquery =
      "SELECT * from operateur inner join travail on operateur.NUMERO_ENREGISTREMENT = travail.NUMERO_ENREGISTREMENT inner join candidat on candidat.NUM_INS = travail.NUM_INS and candidat.DATE_INS = travail.DATE_INS and candidat.NUM_PERMIS = travail.NUM_PERMIS  where travail.NUMERO_ENREGISTREMENT = ?;";
    db.query(sqlquery, [numeroEnregistrement], (err, result) => {
      res.send(result);
    });
  }
);

router.get(
  "/api/get_candidat_foreach_operateur_noVehcule/:NUMERO_ENREGISTREMENT",
  (req, res) => {
    const numeroEnregistrement = req.params.NUMERO_ENREGISTREMENT;
    const sqlquery =
      "SELECT * from operateur inner join travail on operateur.NUMERO_ENREGISTREMENT = travail.NUMERO_ENREGISTREMENT inner join candidat on candidat.NUM_INS = travail.NUM_INS and candidat.DATE_INS = travail.DATE_INS and candidat.NUM_PERMIS = travail.NUM_PERMIS  where travail.NUMERO_ENREGISTREMENT = ? and candidat.MATRECULE IS NULL AND travail.ETAT = 'منتسب';";
    db.query(sqlquery, [numeroEnregistrement], (err, result) => {
      res.send(result);
    });
  }
);

module.exports = router;



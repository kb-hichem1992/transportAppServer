const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/api/getOp", (req, res) => {
  const sqlquery = "SELECT * FROM operateur;";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});

router.post("/delete_operateur", (req, res) => {
  const numeroEnregistrement = req.body.numeroEnregistrement;
  db.query(
    "DELETE FROM `operateur` WHERE (`NUMERO_ENREGISTREMENT` = ?);",
    [numeroEnregistrement],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("deleted");
      }
    }
  );
});

router.post("/Add_operateur", (req, res) => {
  const numeroEnregistrement = req.body.numeroEnregistrement;
  const nomOperateur = req.body.nomOperateur;
  const siege = req.body.siege;
  const propriétaire = req.body.propriétaire;
  const wilaya = req.body.wilaya;
  const date_Enregistrement = req.body.date_Enregistrement;

  db.query(
    "INSERT INTO OPERATEUR (`NOM_OP`, `SIEGE_OP`, `PROPRIETAIRE`, `WILAYA`, `NUMERO_ENREGISTREMENT`, `DATE_ENREGISTREMENT`) VALUES (?, ?, ?, ?, ?, ?);",
    [
      nomOperateur,
      siege,
      propriétaire,
      wilaya,
      numeroEnregistrement,
      date_Enregistrement,
    ],
    (err, result) => {
      if (err !== null && err.errno === 1062) {
        res.send({ message: "هذا المتعامل مسجل من قبل" });
      } else {
        res.send("inserted");
      }
    }
  );
});

router.put("/Update_operateur", (req, res) => {
  const numeroEnregistrement = req.body.numeroEnregistrement;
  const nomOperateur = req.body.nomOperateur;
  const siege = req.body.siege;
  const propriétaire = req.body.propriétaire;
  const wilaya = req.body.wilaya;
  const date_Enregistrement = req.body.date_Enregistrement;

  db.query(
    "UPDATE `operateur` SET `NOM_OP` = ?, `SIEGE_OP` = ?, `PROPRIETAIRE` = ?, `WILAYA` = ?, `DATE_ENREGISTREMENT` = ? WHERE (`NUMERO_ENREGISTREMENT` = ?);",
    [
      nomOperateur,
      siege,
      propriétaire,
      wilaya,
      date_Enregistrement,
      numeroEnregistrement,
    ],
    (err, result) => {
      if (err) {
        console.log(err.code);
      } else {
        res.send("updated");
      }
    }
  );
});

module.exports = router;



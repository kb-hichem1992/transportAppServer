const express = require("express");
const db = require("../db");
const router = express.Router();

router.post("/add_vehicule/:num_enregistrement", (req, res) => {
  const NUMERO_ENREGISTREMENT = req.params.num_enregistrement;
  const MATRECULE = req.body.MATRECULE;
  const GENRE = req.body.GENRE;
  const MARQUE = req.body.MARQUE;
  const PTC = req.body.PTC;
  const PTAC = req.body.PTAC;
  const CU = req.body.CU;
  const NOMBRE_PLACE = req.body.NOMBRE_PLACE;
  const NUM_INS = req.body.NUM_INS;
  const DATE_INS = req.body.DATE_INS;
  const NUM_PERMIS = req.body.NUM_PERMIS;

  db.query(
    "INSERT INTO `vehicule` (`MATRECULE`, `NUMERO_ENREGISTREMENT`, `GENRE`, `MARQUE`, `PTC`, `PTAC`, `CU`, `NOMBRE_PLACE`, `NUM_INS`, `DATE_INS`, `NUM_PERMIS`) VALUES (?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [
      MATRECULE,
      NUMERO_ENREGISTREMENT,
      "marchandise",
      MARQUE,
      PTC,
      PTAC,
      CU,
      NOMBRE_PLACE,
      NUM_INS,
      DATE_INS,
      NUM_PERMIS,
    ],
    (err, result) => {
      if (err && err.errno === 1062) {
        res.send(result.data.message("العربة مسجلة من قبل"));
      } else {
        res.send(result.data.message("  تم التسجيل بنجاح "));
      }
    }
  );
});

router.get("/api/get_veh_Mar", (req, res) => {
  const sqlquery =
    "select *  from vehicule, operateur where vehicule.NUMERO_ENREGISTREMENT = operateur.NUMERO_ENREGISTREMENT and vehicule.GENRE ='marchandise';";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});

router.delete("/delete_vehicule/:MATRECULE", (req, res) => {
  const MATRECULE = req.params.MATRECULE;
  const sqlquery = "delete from vehicule where MATRECULE =?;";
  db.query(sqlquery, [MATRECULE], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("row deleted");
    }
  });
});

router.get("/api/get_veh_voyag", (req, res) => {
  const sqlquery =
    "select vehicule.IMMATRECULATION, vehicule.MARQUE,vehicule.NOMBRE_PLACE, operateur.NOM_OPERATEUR, operateur.PRENOM_OPERATEUR, operateur.PRENOM_PERE  from vehicule, operateur where vehicule.GENRE = 'Voyageur' and vehicule.NUMERO_OPERATEUR = operateur.NUMERO_OPERATEUR;";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});

router.post("/api/add-vehicule", (req, res) => {
  const { lib } = req.body;
  const sql = "INSERT INTO vehicule (id, lib) VALUES (?,?)";
  db.query(sql, [0, lib], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: result.insertId, lib });
  });
});

router.get("/api/vehicules", (req, res) => {
  const query = "SELECT id, lib FROM vehicule";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.json(results);
  });
});

module.exports = router;



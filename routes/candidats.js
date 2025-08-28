const express = require("express");
const db = require("../db");
const { isValueMissing } = require("../utils/validators");
const { convertToDate } = require("../utils/converter");

const router = express.Router();

router.get("/api/get_candidat", (req, res) => { 
  const sqlquery =
    "SELECT c.NUM_INS,c.DATE_INS,c.NUMERO_NAT,c.NOM_CANDIDAT,c.PRENOM_CANDIDAT,c.PRENOM_PERE,c.DATE_NAIS_CANDIDAT,c.LIEU_NAIS_CANDIDAT,c.NIVEAU_SCOL_CANDIDAT,c.ADRESSE_CANDIDAT,c.SEX_CONDIDAT,c.TYPE_CANDIDAT,c.NUM_PERMIS,c.DATE_LIV_PERMIS,c.DATE_EXP_PERMIS,c.TYPE_PERMIS,c.CATEGORIE_PERMIS,c.CREATEUR,c.ID_TYPE_FORMATION,c.ID_VEHICULE,c.TELE_FIRST,c.TELE_SECOND,c.MONTANT,c.RESTE,v.lib VEHICULE,tf.LIB FORMATION, tf.PRIX FROM candidat c LEFT JOIN type_formation tf ON c.ID_TYPE_FORMATION = tf.id LEFT JOIN vehicule v ON v.ID = c.ID_VEHICULE;";
  db.query(sqlquery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.get("/api/get_candidat/:createur", (req, res) => {
  const createur = req.params.createur;
  const sqlquery =
    "SELECT c.NUM_INS,c.DATE_INS,c.NUMERO_NAT,c.NOM_CANDIDAT,c.PRENOM_CANDIDAT,c.PRENOM_PERE,c.DATE_NAIS_CANDIDAT,c.LIEU_NAIS_CANDIDAT,c.NIVEAU_SCOL_CANDIDAT,c.ADRESSE_CANDIDAT,c.SEX_CONDIDAT,c.TYPE_CANDIDAT,c.NUM_PERMIS,c.DATE_LIV_PERMIS,c.DATE_EXP_PERMIS,c.TYPE_PERMIS,c.CATEGORIE_PERMIS,c.CREATEUR,c.ID_TYPE_FORMATION,c.ID_VEHICULE,c.TELE_FIRST,c.TELE_SECOND,c.MONTANT,c.RESTE,v.lib VEHICULE,tf.LIB FORMATION ,  tf.PRIX FROM candidat c LEFT JOIN type_formation tf ON c.ID_TYPE_FORMATION = tf.id LEFT JOIN vehicule v ON v.ID = c.ID_VEHICULE where c.CREATEUR = ?;";
  db.query(sqlquery, [createur], (err, result) => {
    res.send(result);
  });
});

router.get("/api/get_candidat_notAffected", (req, res) => {
  const sqlquery =
    "SELECT  * FROM candidat WHERE (candidat.NUM_INS , candidat.DATE_INS, candidat.NUM_PERMIS) NOT IN (SELECT candidat.NUM_INS, candidat.DATE_INS, candidat.NUM_PERMIS FROM candidat, travail WHERE candidat.NUM_INS = travail.NUM_INS AND candidat.DATE_INS = travail.DATE_INS AND candidat.NUM_PERMIS = travail.NUM_PERMIS AND travail.ETAT = 'منتسب')";
  db.query(sqlquery, (err, result) => {
    res.send(result);
  });
});

router.post("/Add_condidat", (req, res) => {
  const numeroCandidat = req.body.numeroCandidat;
  const Date_ins = convertToDate(req.body.Date_ins);
  const num_Nationnal = req.body.num_Nationnal;
  const Nom = req.body.Nom;
  const Prénom = req.body.Prénom;
  const Date_naissance =convertToDate(req.body.Date_naissance);
  const Lieu_naissance = req.body.Lieu_naissance;
  const Niveau = req.body.Niveau;
  const Adresse = req.body.Adresse;
  const Prénom_Pére = req.body.Prénom_Pére;
  const Sexe = req.body.Sexe;
  const Type_Candidat = req.body.Type_Candidat;
  const Num_permis = req.body.Num_permis;
  const date_liv = convertToDate(req.body.date_liv);
  const type_permis = req.body.type_permis;
  const categorie_permis = req.body.categorie_permis;
  const createur = req.body.createur;

  db.query(
    "INSERT INTO candidat (`NUM_INS`, `DATE_INS`,`NUMERO_NAT`,`NOM_CANDIDAT`, `PRENOM_CANDIDAT`, `DATE_NAIS_CANDIDAT`, `LIEU_NAIS_CANDIDAT`, `NIVEAU_SCOL_CANDIDAT`, `ADRESSE_CANDIDAT`, `PRENOM_PERE`, `SEX_CONDIDAT`,`TYPE_CANDIDAT`,`NUM_PERMIS`, `DATE_LIV_PERMIS`, `TYPE_PERMIS`, `CATEGORIE_PERMIS`, `createur` ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      numeroCandidat,
      Date_ins,
      num_Nationnal,
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
      type_permis,
      categorie_permis,
      createur,
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

router.post("/api/candidats", (req, res) => {
  const {
    NUM_INS,
    DATE_INS,
    NUMERO_NAT,
    NOM_CANDIDAT,
    PRENOM_CANDIDAT,
    PRENOM_PERE,
    DATE_NAIS_CANDIDAT,
    LIEU_NAIS_CANDIDAT,
    NIVEAU_SCOL_CANDIDAT,
    ADRESSE_CANDIDAT,
    SEX_CONDIDAT,
    TYPE_CANDIDAT,
    NUM_PERMIS,
    TYPE_PERMIS,
    CATEGORIE_PERMIS,
    CREATEUR,
    ID_TYPE_FORMATION,
    ID_VEHICULE,
    TELE_FIRST,
    TELE_SECOND,
    MONTANT,
    RESTE,
  } = req.body;

  const query = `
    INSERT INTO candidat (
      NUM_INS, DATE_INS, NUMERO_NAT, NOM_CANDIDAT, PRENOM_CANDIDAT, PRENOM_PERE,
      DATE_NAIS_CANDIDAT, LIEU_NAIS_CANDIDAT, NIVEAU_SCOL_CANDIDAT, ADRESSE_CANDIDAT, SEX_CONDIDAT,
      TYPE_CANDIDAT, NUM_PERMIS, TYPE_PERMIS, CATEGORIE_PERMIS,
      CREATEUR, ID_TYPE_FORMATION, ID_VEHICULE,TELE_FIRST,TELE_SECOND, MONTANT, RESTE
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?, ?);
  `;
  const values = [
    NUM_INS,
    DATE_INS,
    NUMERO_NAT,
    NOM_CANDIDAT,
    PRENOM_CANDIDAT,
    PRENOM_PERE,
    DATE_NAIS_CANDIDAT,
    LIEU_NAIS_CANDIDAT,
    NIVEAU_SCOL_CANDIDAT,
    ADRESSE_CANDIDAT,
    SEX_CONDIDAT,
    TYPE_CANDIDAT,
    NUM_PERMIS,
    TYPE_PERMIS,
    CATEGORIE_PERMIS,
    CREATEUR,
    ID_TYPE_FORMATION,
    ID_VEHICULE,
    TELE_FIRST,
    TELE_SECOND,
    MONTANT,
    RESTE,
  ];

  if (
    isValueMissing(NUM_INS) ||
    isValueMissing(DATE_INS) ||
    isValueMissing(NOM_CANDIDAT) ||
    isValueMissing(PRENOM_CANDIDAT) ||
    isValueMissing(PRENOM_PERE) ||
    isValueMissing(DATE_NAIS_CANDIDAT) ||
    isValueMissing(NIVEAU_SCOL_CANDIDAT) ||
    isValueMissing(ADRESSE_CANDIDAT) ||
    isValueMissing(SEX_CONDIDAT) ||
    isValueMissing(NUM_PERMIS) ||
    isValueMissing(TYPE_PERMIS) ||
    isValueMissing(CATEGORIE_PERMIS) ||
    isValueMissing(ID_TYPE_FORMATION) ||
    isValueMissing(ID_VEHICULE) ||
    isValueMissing(TELE_FIRST) ||
    isValueMissing(MONTANT) ||
    isValueMissing(RESTE)
  ) {
    return res.status(400).json({ error: "All fields are required" });
  }
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting into the database:", err);
      res.status(500).json({ error: "Database insertion error" });
      return;
    }
    res
      .status(201)
      .json({ message: "Candidat added successfully", id: result.insertId });
  });
});

router.put("/api/updateCandidat/:NUM_INS/:DATE_INS/:NUM_PERMIS", (req, res) => {
  const { NUM_INS, DATE_INS, NUM_PERMIS } = req.params;
  const candidat = req.body;
  let sql = `UPDATE candidat SET NUMERO_NAT = ?, NOM_CANDIDAT = ?, PRENOM_CANDIDAT = ?, PRENOM_PERE = ?, DATE_NAIS_CANDIDAT = ?, LIEU_NAIS_CANDIDAT = ?, NIVEAU_SCOL_CANDIDAT = ?, ADRESSE_CANDIDAT = ?, SEX_CONDIDAT = ?, TYPE_CANDIDAT = ?, DATE_LIV_PERMIS = ?, DATE_EXP_PERMIS = ?, TYPE_PERMIS = ?, CATEGORIE_PERMIS = ?, CREATEUR = ?, ID_TYPE_FORMATION = ?, ID_VEHICULE = ?, TELE_FIRST = ?, TELE_SECOND = ?, MONTANT = ?, RESTE = ? WHERE NUM_INS = ? AND DATE_INS = ? AND NUM_PERMIS = ?`;
  const values = [
    candidat.NUMERO_NAT,
    candidat.NOM_CANDIDAT,
    candidat.PRENOM_CANDIDAT,
    candidat.PRENOM_PERE,
    candidat.DATE_NAIS_CANDIDAT,
    candidat.LIEU_NAIS_CANDIDAT,
    candidat.NIVEAU_SCOL_CANDIDAT,
    candidat.ADRESSE_CANDIDAT,
    candidat.SEX_CONDIDAT,
    candidat.TYPE_CANDIDAT,
    candidat.DATE_LIV_PERMIS,
    candidat.DATE_EXP_PERMIS,
    candidat.TYPE_PERMIS,
    candidat.CATEGORIE_PERMIS,
    candidat.CREATEUR,
    candidat.ID_TYPE_FORMATION,
    candidat.ID_VEHICULE,
    candidat.TELE_FIRST,
    candidat.TELE_SECOND,
    candidat.MONTANT,
    candidat.RESTE,
    NUM_INS,
    convertToDate(DATE_INS),
    NUM_PERMIS,
  ];
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send("Candidat updated successfully");
  });
});

router.put("/update_candidat", (req, res) => {
  const numeroCandidat = req.body.numeroCandidat;
  const numins = req.body.numins;
  const Date_ins = req.body.Date_ins;
  const num_Nationnal = req.body.num_Nationnal;
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
  const type_permis = req.body.type_permis;
  const categorie_permis = req.body.categorie_permis;
  const DATE_INS = req.body.DATE_INS;
  const createur = req.body.createur;
  db.query(
    "UPDATE candidat SET `NUM_INS`=?, `NUMERO_NAT`= ? , `NOM_CANDIDAT`=?, `PRENOM_CANDIDAT`= ?, `DATE_NAIS_CANDIDAT`=? , `LIEU_NAIS_CANDIDAT`= ?, `NIVEAU_SCOL_CANDIDAT`= ?, `ADRESSE_CANDIDAT`= ?, `PRENOM_PERE`= ?, `SEX_CONDIDAT` = ?, `TYPE_CANDIDAT`= ?,`DATE_LIV_PERMIS` = ?, `CATEGORIE_PERMIS` = ?, `TYPE_PERMIS` = ?, `DATE_INS` = ?   WHERE  `NUM_PERMIS` = ? and `DATE_INS` = ? and `NUM_INS` = ? ;",
    [
      numins,
      num_Nationnal,
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
      categorie_permis,
      type_permis,
      Date_ins,
      Num_permis,
      DATE_INS,
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

router.put("/update_NUMINS", (req, res) => {
  const numeroCandidat = req.body.numeroCandidat;
  const newNum = req.body.newNum;
  const Num_permis = req.body.Num_permis;
  const Date_ins = req.body.Date_ins;

  db.query(
    "UPDATE candidat SET `NUM_INS`=? WHERE  `NUM_PERMIS` = ? and `DATE_INS` = ? and `NUM_INS` = ? ;",
    [newNum, Num_permis, Date_ins, numeroCandidat],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

router.post("/delete_candidat", (req, res) => {
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

router.get("/api/getCentre/:numeroAgrement", (req, res) => {
  const numeroAgrement = req.params.numeroAgrement;
  db.query(
    "SELECT NOM_CENTRE FROM centre where NUMERO_AGREMENT = ?",
    [numeroAgrement],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      } else {
        res.send(result);
      }
    }
  );
});

router.get("/api/getUser/:username/:password", (req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  db.query(
    "SELECT * FROM  user  where USERNAME = ?  and PASSWORD = ?",
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = router;



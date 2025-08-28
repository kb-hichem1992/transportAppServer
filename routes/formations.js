const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

// Require valid JWT for all formation routes
router.use(authenticateToken);

router.get("/api/type_formation", (req, res) => {
  const query = "SELECT id, lib, prix FROM type_formation";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Database error" });
      return;
    }
    res.json(results);
  });
});

router.get("/api/get_form/:numeroAgrement", (req, res) => {
  const numeroAgrement = req.params.numeroAgrement;
  const sqlquery =
    "select formation.NUMERO_FORMATION, formation.GROUPE, formation.TYPE_GROUPE, formation.NUMERO_AGREMENT,formation.TYPE_FORMATION, formation.DEBUT, formation.FIN from formation where formation.NUMERO_AGREMENT =? ;";
  db.query(sqlquery, [numeroAgrement], (err, result) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    } else {
      res.send(result);
    }
  });
});

router.post("/Add_formation", (req, res) => {
  const numeroFormation = req.body.numeroFormation;
  const numeroAgrement = req.body.numeroAgrement;
  const groupe = req.body.groupe;
  const Type = req.body.Type;
  const Debut = req.body.Debut;
  const Fin = req.body.Fin;
  const type_groupe = req.body.type_groupe;
  db.query(
    "INSERT INTO formation (`NUMERO_FORMATION`, `NUMERO_AGREMENT` , `GROUPE` ,`TYPE_FORMATION`, `DEBUT`, `FIN`, TYPE_GROUPE) VALUES (?,?,?,?,?,?,?)",
    [numeroFormation, numeroAgrement, groupe, Type, Debut, Fin, type_groupe],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

router.put("/update_formation", (req, res) => {
  const Type = req.body.Type;
  const Debut = req.body.Debut;
  const Fin = req.body.Fin;
  const numeroFormation = req.body.numeroFormation;
  const numeroAgrement = req.body.numeroAgrement;
  const groupe = req.body.groupe;
  const type_groupe = req.body.type_groupe;
  db.query(
    "UPDATE formation SET `TYPE_FORMATION`= ?, `DEBUT`= ?, `FIN`= ?, TYPE_GROUPE = ? WHERE `NUMERO_FORMATION`=? and `NUMERO_AGREMENT` = ? and `GROUPE`= ?;",
    [Type, Debut, Fin, type_groupe, numeroFormation, numeroAgrement, groupe],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Values updated");
      }
    }
  );
});

router.delete(
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

module.exports = router;



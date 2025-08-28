const express = require("express");
const db = require("../db");
const router = express.Router();

router.get("/api/getCon", (req, res) => {
  const sqlquery = "SELECT etat FROM connection where id ='1'";
  db.query(sqlquery, (err, result) => {
    if (err) {
      console.log(err);
      return res.sendStatus(500);
    }
    res.send(result);
  });
});

router.get("/HOME", (req, res) => {
  res.send("Welcome");
});

router.get("/get_Statistic", (req, res) => {
  const sqlquery = "select * from stat where num_agrement = 'direction';";
  db.query(sqlquery, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

router.post("/Statistque/:id", (req, res) => {
  const id = req.params.id;

  const sqlquery = "call get_stat(?);";
  db.query(sqlquery, [id], (err, result) => {
    if (err) {
      res.send(err.message);
      console.log(err.message);
    } else {
      res.send("Done !! ");
    }
  });
});

module.exports = router;



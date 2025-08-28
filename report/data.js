
var mq = require("../db.js");
const { convertToDate } = require("../utils/converter")

function GetDiplomeData(NumIns, NumForm, DateIns, NumAGR, Groupe, callback) {
  let dateIns = convertToDate(DateIns)
  console.log(dateIns);

  mq.query(
    `SELECT NOM_CANDIDAT,PRENOM_CANDIDAT,DATE_NAIS_CANDIDAT,LIEU_NAIS_CANDIDAT,ADRESSE_CANDIDAT,TYPE_FORMATION
    FROM candidat,passe,formation WHERE passe.NUM_INS=? and passe.NUMERO_FORMATION=?  and passe.DATE_INS=?
    AND passe.NUMERO_AGREMENT=? AND  passe.GROUPE=?  AND passe.DATE_INS=candidat.DATE_INS
    AND passe.NUM_INS=candidat.NUM_INS  AND passe.NUMERO_FORMATION=formation.NUMERO_FORMATION `,
    [NumIns, NumForm, dateIns, NumAGR, Groupe],
    (err, result) => {
      if (err) throw err;

      return callback(result);
    }
  );
}

function GetEvaluationData(NumIns, DateIns, callback) {

  let dateIns = convertToDate(DateIns)
  mq.query(
    `SELECT NUMERO_NAT, NOM_CANDIDAT,PRENOM_CANDIDAT,DATE_NAIS_CANDIDAT,LIEU_NAIS_CANDIDAT,ADRESSE_CANDIDAT,DATE_INS,NUM_INS,CATEGORIE_PERMIS
 FROM candidat WHERE NUM_INS=?   and DATE_INS=?  `,
    [NumIns, dateIns],
    (err, result) => {
      if (err) throw err;

      return callback(result);
    }
  );
}

module.exports = {
  GetDiplomeData: GetDiplomeData,
  GetEvaluationData: GetEvaluationData,
};

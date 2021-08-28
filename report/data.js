var mq=require('../index.js');



function GetCondidatById(idi,callback)
{

 
 
 
  mq.query("SELECT * FROM transport.candidat where NUM_INS = ?",idi,(err, result) => {
    
    if (err) throw err;

   
   return callback(result); 
   



  });
 

}




function GetDiplomeData(NumIns,NumForm,DateIns,NumAGR,Groupe,callback)
{


mq.query( `SELECT NOM_CANDIDAT,PRENOM_CANDIDAT,DATE_NAIS_CANDIDAT,LIEU_NAIS_CANDIDAT,ADRESSE_CANDIDAT,TYPE_FORMATION
 FROM candidat,passe,formation WHERE passe.NUM_INS=? and passe.NUMERO_FORMATION=?  and passe.DATE_INS=?
 AND passe.NUMERO_AGREMENT=? AND  passe.GROUPE=?  AND passe.DATE_INS=candidat.DATE_INS
 AND passe.NUM_INS=candidat.NUM_INS  AND passe.NUMERO_FORMATION=formation.NUMERO_FORMATION `,[NumIns,NumForm,DateIns,NumAGR,Groupe],
 (err, result) => {
    
    if (err) throw err;

   
   return callback(result); 
   



  });


}



function GetEvaluationData(NumIns,DateIns,callback)
{


mq.query( `SELECT NOM_CANDIDAT,PRENOM_CANDIDAT,DATE_NAIS_CANDIDAT,LIEU_NAIS_CANDIDAT,ADRESSE_CANDIDAT,DATE_INS,NUM_INS,CATEGORIE_PERMIS
 FROM candidat WHERE NUM_INS=?   and DATE_INS=?  `,[NumIns,DateIns],
 (err, result) => {
    
    if (err) throw err;

   
   return callback(result); 
   



  });


}
















module.exports = {GetDiplomeData:GetDiplomeData,GetEvaluationData:GetEvaluationData};
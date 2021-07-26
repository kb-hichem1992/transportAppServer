var mq=require('../index.js');



function GetCondidatById(idi,callback)
{

 
 
 
  mq.query("SELECT * FROM transport.candidat where NUM_INS = ?",idi,(err, result) => {
    
    if (err) throw err;

   
   return callback(result); 
   



  });
 

}




function GetDiplomeData(NumIns,NumForm,NumPerm,DateIns,NumAGR,Groupe,callback)
{


mq.query( `SELECT NOM_CANDIDAT,PRENOM_CANDIDAT,DATE_NAIS_CANDIDAT,LIEU_NAIS_CANDIDAT,ADRESSE_CANDIDAT,TYPE_FORMATION
 FROM candidat,passe,formation WHERE passe.NUM_INS=? and passe.NUMERO_FORMATION=? and passe.NUM_PERMIS=? and passe.DATE_INS=?
 AND passe.NUMERO_AGREMENT=? AND  passe.GROUPE=?  AND passe.DATE_INS=candidat.DATE_INS
 AND passe.NUM_INS=candidat.NUM_INS AND passe.NUM_PERMIS=candidat.NUM_PERMIS AND passe.NUMERO_FORMATION=formation.NUMERO_FORMATION `,[NumIns,NumForm,NumPerm,DateIns,NumAGR,Groupe],
 (err, result) => {
    
    if (err) throw err;

   
   return callback(result); 
   



  });


}



function GetEvaluationData(NumIns,NumPerm,DateIns,callback)
{


mq.query( `SELECT NOM_CANDIDAT,PRENOM_CANDIDAT,DATE_NAIS_CANDIDAT,LIEU_NAIS_CANDIDAT,ADRESSE_CANDIDAT,DATE_INS,NUM_INS
 FROM candidat WHERE NUM_INS=?  and NUM_PERMIS=? and DATE_INS=?  `,[NumIns,NumPerm,DateIns],
 (err, result) => {
    
    if (err) throw err;

   
   return callback(result); 
   



  });


}
















module.exports = {GetDiplomeData:GetDiplomeData,GetEvaluationData:GetEvaluationData};
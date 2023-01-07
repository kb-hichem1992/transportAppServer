SELECT 
    passe.BREVET,
    candidat.NOM_CANDIDAT,
    candidat.PRENOM_CANDIDAT,
    candidat.PRENOM_PERE,
    candidat.DATE_NAIS_CANDIDAT,
    passe.LIV_BREVET,
    passe.EXP_BREVET,
    formation.TYPE_FORMATION,
    passe.NUMERO_FORMATION,
    passe.NUM_INS,
    passe.NUM_PERMIS,
    passe.DATE_INS,
    passe.NUMERO_AGREMENT,
    passe.GROUPE
FROM
    ((passe
    INNER JOIN candidat ON candidat.NUM_INS = passe.NUM_INS
        AND candidat.DATE_INS = passe.DATE_INS
        AND candidat.NUM_PERMIS = passe.NUM_PERMIS)
    INNER JOIN formation ON formation.NUMERO_FORMATION = passe.NUMERO_FORMATION
        AND formation.NUMERO_AGREMENT = passe.NUMERO_AGREMENT
        AND formation.GROUPE = passe.GROUPE)
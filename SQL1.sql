/*==============================================================*/
/* Nom de SGBD :  MySQL 5.0                                     */
/* Date de création :  15/07/2021 11:23:44                      */
/*==============================================================*/


drop table if exists CANDIDAT;

drop table if exists CENTRE;

drop table if exists FORMATION;

drop table if exists LIGNE;

drop table if exists OPERATEUR;

drop table if exists PASSE;

drop table if exists PER_CIRCULE;

drop table if exists TRAVAIL;

drop table if exists USER;

drop table if exists VEHICULE;

/*==============================================================*/
/* Table : CANDIDAT                                             */
/*==============================================================*/
create table CANDIDAT
(
   NUM_INS              varchar(20) not null,
   DATE_INS             date not null,
   NOM_CANDIDAT         char(50) not null,
   PRENOM_CANDIDAT      char(50) not null,
   PRENOM_PERE          varchar(50) not null,
   DATE_NAIS_CANDIDAT   date not null,
   LIEU_NAIS_CANDIDAT   varchar(20) not null,
   NIVEAU_SCOL_CANDIDAT varchar(50),
   ADRESSE_CANDIDAT     varchar(100),
   SEX_CONDIDAT         char(10),
   TYPE_CANDIDAT        varchar(20),
   NUM_PERMIS           varchar(45) not null,
   DATE_LIV_PERMIS      date,
   DATE_EXP_PERMIS      date,
   TYPE_PERMIS          varchar(50),
   CATEGORIE_PERMIS     varchar(50),
   primary key (NUM_INS, DATE_INS, NUM_PERMIS)
);

/*==============================================================*/
/* Table : CENTRE                                               */
/*==============================================================*/
create table CENTRE
(
   NUMERO_AGREMENT      varchar(50) not null,
   NOM_CENTRE           varchar(50),
   SIEGE                varchar(100),
   primary key (NUMERO_AGREMENT)
);

/*==============================================================*/
/* Table : FORMATION                                            */
/*==============================================================*/
create table FORMATION
(
   NUMERO_FORMATION     int not null,
   GROUPE               int not null,
   NUMERO_AGREMENT      varchar(50) not null,
   TYPE_FORMATION       varchar(50),
   DEBUT                date,
   FIN                  date,
   primary key (NUMERO_FORMATION, GROUPE, NUMERO_AGREMENT)
);

/*==============================================================*/
/* Table : LIGNE                                                */
/*==============================================================*/
create table LIGNE
(
   NUM_INS              varchar(20) not null,
   DATE_INS             date not null,
   NUM_PERMIS           varchar(45) not null,
   MATRECULE            varchar(10) not null,
   NUM_LIGNE            varchar(100) not null,
   TYPE_LIGNE           varchar(50),
   DATE_LIV_LIGNE       date,
   DATE_EXP_LIGNE       date,
   primary key (NUM_INS, DATE_INS, NUM_PERMIS, MATRECULE, NUM_LIGNE)
);

/*==============================================================*/
/* Table : OPERATEUR                                            */
/*==============================================================*/
create table OPERATEUR
(
   NOM_OP               char(50) not null,
   SIEGE_OP             varchar(100),
   primary key (NOM_OP)
);

/*==============================================================*/
/* Table : PASSE                                                */
/*==============================================================*/
create table PASSE
(
   NUM_INS              varchar(20) not null,
   DATE_INS             date not null,
   NUM_PERMIS           varchar(45) not null,
   NUMERO_FORMATION     int not null,
   GROUPE               int not null,
   NUMERO_AGREMENT      varchar(50) not null,
   NOTE                 int,
   REMARQUE             varchar(50),
   BREVET               varchar(45),
   LIV_BREVET           date,
   EXP_BREVET           date,
   PRINTED		int(1) DEFAULT 0 ,
   primary key (NUM_INS, DATE_INS, NUM_PERMIS, NUMERO_FORMATION, GROUPE, NUMERO_AGREMENT),
   key FK_PASSE (NUMERO_FORMATION)
);

/*==============================================================*/
/* Table : PER_CIRCULE                                          */
/*==============================================================*/
create table PER_CIRCULE
(
   NUM_INS              varchar(20) not null,
   DATE_INS             date not null,
   NUM_PERMIS           varchar(45) not null,
   MATRECULE            varchar(10) not null,
   NUM_PER              varchar(40) not null,
   DATE_LIV_PER         date,
   DATE_EXP_PER         date,
   primary key (NUM_INS, DATE_INS, NUM_PERMIS, MATRECULE, NUM_PER)
);

/*==============================================================*/
/* Table : TRAVAIL                                              */
/*==============================================================*/
create table TRAVAIL
(
   NUM_INS              varchar(20) not null,
   DATE_INS             date not null,
   NUM_PERMIS           varchar(45) not null,
   NOM_OP               char(50) not null,
   DATE_RECRUT          date not null,
   DATE_FIN             date,
   ETAT                 varchar(10),
   primary key (NUM_INS, DATE_INS, NUM_PERMIS, NOM_OP),
   key FK_TRAVAIL (NOM_OP)
);

/*==============================================================*/
/* Table : USER                                                 */
/*==============================================================*/
create table USER
(
   USERNAME             varchar(50) not null,
   PASSWORD             varchar(50) not null,
   ADMIN                varchar(10) not null,
   NUMERO_AGREMENT      varchar(50) not null,
   primary key (USERNAME, PASSWORD, ADMIN)
);

/*==============================================================*/
/* Table : VEHICULE                                             */
/*==============================================================*/
create table VEHICULE
(
   MATRECULE            varchar(10) not null,
   NOM_OP               char(50) not null,
   GENRE                varchar(20),
   MARQUE               varchar(20),
   PTC                  numeric(10,3),
   PTAC                 numeric(10,3),
   CU                   numeric(10,3),
   NOMBRE_PLACE         int,
   primary key (MATRECULE),
   key FK_APPARTIENT (NOM_OP)
);

alter table FORMATION add constraint FK_OFFRE foreign key (NUMERO_AGREMENT)
      references CENTRE (NUMERO_AGREMENT)  on delete cascade on update cascade;

alter table LIGNE add constraint FK_LIGNE foreign key (MATRECULE)
      references VEHICULE (MATRECULE)  on delete cascade on update cascade;

alter table LIGNE add constraint FK_LIGNE2 foreign key (NUM_INS, DATE_INS, NUM_PERMIS)
      references CANDIDAT (NUM_INS, DATE_INS, NUM_PERMIS)  on delete cascade on update cascade;

alter table PASSE add constraint FK_PASSE3 foreign key (NUMERO_FORMATION, GROUPE, NUMERO_AGREMENT)
      references FORMATION (NUMERO_FORMATION, GROUPE, NUMERO_AGREMENT)  on delete cascade on update cascade;

alter table PASSE add constraint FK_PASSE2 foreign key (NUM_INS, DATE_INS, NUM_PERMIS)
      references CANDIDAT (NUM_INS, DATE_INS, NUM_PERMIS)  on delete cascade on update cascade;

alter table PER_CIRCULE add constraint FK_PER_CIRCULE foreign key (MATRECULE)
      references VEHICULE (MATRECULE) on delete cascade on update cascade;

alter table PER_CIRCULE add constraint FK_PER_CIRCULE2 foreign key (NUM_INS, DATE_INS, NUM_PERMIS)
      references CANDIDAT (NUM_INS, DATE_INS, NUM_PERMIS)  on delete cascade on update cascade;

alter table TRAVAIL add constraint FK_TRAVAIL foreign key (NOM_OP)
      references OPERATEUR (NOM_OP) on delete cascade on update cascade;

alter table TRAVAIL add constraint FK_TRAVAIL2 foreign key (NUM_INS, DATE_INS, NUM_PERMIS)
      references CANDIDAT (NUM_INS, DATE_INS, NUM_PERMIS) on delete cascade on update cascade;

alter table USER add constraint FK_CONTIENT foreign key (NUMERO_AGREMENT)
      references CENTRE (NUMERO_AGREMENT)  on delete cascade on update cascade;

alter table VEHICULE add constraint FK_APPARTIENT foreign key (NOM_OP)
      references OPERATEUR (NOM_OP)  on delete cascade on update cascade;
      
LOCK TABLES `candidat` WRITE;
/*!40000 ALTER TABLE `candidat` DISABLE KEYS */;
INSERT INTO `candidat` VALUES ('00002','2021-07-19','حاج هني','كريم','محمد','1991-07-19','الشلف','متوسط','56 شارع ي البقعة','ذكر','متعاقد','61696947','2021-07-19','2030-10-26','بيومتري','A1,C1,C1E'),('0001','2021-07-19','بوجلطية','محمد','احمد','1992-07-19','الشلف','متوسط','الشطية','ذكر','حر','0055569','2019-07-19','2029-07-19','القديم','A2,B');
/*!40000 ALTER TABLE `candidat` ENABLE KEYS */;
UNLOCK TABLES;




LOCK TABLES `formation` WRITE;
/*!40000 ALTER TABLE `formation` DISABLE KEYS */;
INSERT INTO `formation` VALUES (1,1,2,'نقل البضائع','2021-07-15','2021-09-15'),(1,2,2,'نقل المسافرين','2021-07-15','2021-08-15'),(1,3,2,'نفل المواد الخطيرة','2021-07-16','2021-09-16'),(2,1,2,'نقل البضائع','2021-07-16','2021-09-16'),(2,2,2,'نقل المسافرين','2021-07-16','2021-10-16');
/*!40000 ALTER TABLE `formation` ENABLE KEYS */;
UNLOCK TABLES;

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('assim','assim','admin','2');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
drop table operateur;
drop table per_circule;
drop table travail;
drop table ligne;
drop table vehicule;

create table OPERATEUR
(
   NOM_OP               char(50),
   SIEGE_OP             varchar(100),
   PROPRIETAIRE         varchar(50),
   WILAYA               varchar(20),
   NUMERO_ENREGISTREMENT varchar(50) not null,
   primary key (NUMERO_ENREGISTREMENT)
);
create table VEHICULE
(
   MATRECULE            varchar(10) not null,
   NUMERO_ENREGISTREMENT varchar(50) not null,
   GENRE                varchar(20),
   MARQUE               varchar(20),
   PTC                  numeric(10,3),
   PTAC                 numeric(10,3),
   CU                   numeric(10,3),
   NOMBRE_PLACE         int,
   primary key (MATRECULE)
);

create table TRAVAIL
(
   NUMERO_ENREGISTREMENT varchar(50) not null,
   NUM_INS              varchar(20) not null,
   DATE_INS             date not null,
   NUM_PERMIS           varchar(45) not null,
   DATE_RECRUT          date not null,
   DATE_FIN             date,
   ETAT                 varchar(10),
   primary key (NUMERO_ENREGISTREMENT)
);

create table PER_CIRCULE
(
   NUMERO_ENREGISTREMENT varchar(50) not null,
   MATRECULE            varchar(10) not null,
   NUM_PER              varchar(40),
   DATE_LIV_PER         date,
   DATE_EXP_PER         date,
   primary key (NUMERO_ENREGISTREMENT, MATRECULE)
);

create table LIGNE
(
   NUMERO_ENREGISTREMENT varchar(50) not null,
   MATRECULE            varchar(10) not null,
   NUM_LIGNE            varchar(100),
   TYPE_LIGNE           varchar(50),
   DATE_LIV_LIGNE       date,
   DATE_EXP_LIGNE       date,
   primary key (NUMERO_ENREGISTREMENT, MATRECULE)
);
SET FOREIGN_KEY_CHECKS = 1;

SHOW ENGINE INNODB STATUS;

alter table LIGNE add constraint FK_LIGNE foreign key (MATRECULE)
      references VEHICULE (MATRECULE) on delete cascade on update cascade;

alter table LIGNE add constraint FK_LIGNE2 foreign key (NUMERO_ENREGISTREMENT)
      references OPERATEUR (NUMERO_ENREGISTREMENT) on delete cascade on update cascade;

alter table PER_CIRCULE add constraint FK_PER_CIRCULE foreign key (MATRECULE)
      references VEHICULE (MATRECULE) on delete cascade on update cascade;

alter table PER_CIRCULE add constraint FK_PER_CIRCULE2 foreign key (NUMERO_ENREGISTREMENT)
      references OPERATEUR (NUMERO_ENREGISTREMENT) on delete cascade on update cascade;

alter table TRAVAIL add constraint FK_TRAVAIL foreign key (NUM_INS, DATE_INS, NUM_PERMIS)
      references CANDIDAT (NUM_INS, DATE_INS, NUM_PERMIS) on delete cascade on update cascade;
      
alter table TRAVAIL add constraint FK_TRAVAIL2 foreign key (NUMERO_ENREGISTREMENT)
      references OPERATEUR (NUMERO_ENREGISTREMENT) on delete cascade on update cascade;

alter table VEHICULE add constraint FK_APPARTIENT foreign key (NUMERO_ENREGISTREMENT)
      references OPERATEUR (NUMERO_ENREGISTREMENT) on delete cascade on update cascade;

ALTER TABLE PER_CIRCULE 
CHANGE COLUMN `NUM_PER` `NUM_PER` VARCHAR(40) NOT NULL ,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`NUMERO_ENREGISTREMENT`, `MATRECULE`, `NUM_PER`);

ALTER TABLE LIGNE 
CHANGE COLUMN `NUM_LIGNE` `NUM_LIGNE` VARCHAR(100) NOT NULL ,
DROP PRIMARY KEY,
ADD PRIMARY KEY (`NUMERO_ENREGISTREMENT`, `MATRECULE`, `NUM_LIGNE`);
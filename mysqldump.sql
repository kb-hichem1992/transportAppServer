-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: localhost    Database: transport_app
-- ------------------------------------------------------
-- Server version	8.0.31-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `LIGNE`
--

DROP TABLE IF EXISTS `LIGNE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `LIGNE` (
  `NUMERO_ENREGISTREMENT` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `MATRECULE` varchar(10) COLLATE utf8mb3_unicode_ci NOT NULL,
  `NUM_LIGNE` varchar(100) COLLATE utf8mb3_unicode_ci NOT NULL,
  `TYPE_LIGNE` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `DATE_LIV_LIGNE` date DEFAULT NULL,
  `DATE_EXP_LIGNE` date DEFAULT NULL,
  PRIMARY KEY (`NUMERO_ENREGISTREMENT`,`MATRECULE`,`NUM_LIGNE`),
  KEY `FK_LIGNE` (`MATRECULE`),
  CONSTRAINT `FK_LIGNE` FOREIGN KEY (`MATRECULE`) REFERENCES `VEHICULE` (`MATRECULE`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_LIGNE2` FOREIGN KEY (`NUMERO_ENREGISTREMENT`) REFERENCES `OPERATEUR` (`NUMERO_ENREGISTREMENT`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `OPERATEUR`
--

DROP TABLE IF EXISTS `OPERATEUR`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `OPERATEUR` (
  `NOM_OP` char(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `SIEGE_OP` varchar(100) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `PROPRIETAIRE` varchar(50) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `WILAYA` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `NUMERO_ENREGISTREMENT` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `DATE_ENREGISTREMENT` date DEFAULT NULL,
  PRIMARY KEY (`NUMERO_ENREGISTREMENT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `PER_CIRCULE`
--

DROP TABLE IF EXISTS `PER_CIRCULE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PER_CIRCULE` (
  `NUMERO_ENREGISTREMENT` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `MATRECULE` varchar(10) COLLATE utf8mb3_unicode_ci NOT NULL,
  `NUM_PER` varchar(40) COLLATE utf8mb3_unicode_ci NOT NULL,
  `DATE_LIV_PER` date DEFAULT NULL,
  `DATE_EXP_PER` date DEFAULT NULL,
  PRIMARY KEY (`NUMERO_ENREGISTREMENT`,`MATRECULE`,`NUM_PER`),
  KEY `FK_PER_CIRCULE` (`MATRECULE`),
  CONSTRAINT `FK_PER_CIRCULE` FOREIGN KEY (`MATRECULE`) REFERENCES `VEHICULE` (`MATRECULE`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_PER_CIRCULE2` FOREIGN KEY (`NUMERO_ENREGISTREMENT`) REFERENCES `OPERATEUR` (`NUMERO_ENREGISTREMENT`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TRAVAIL`
--

DROP TABLE IF EXISTS `TRAVAIL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TRAVAIL` (
  `NUMERO_ENREGISTREMENT` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `NUM_INS` varchar(20) COLLATE utf8mb3_unicode_ci NOT NULL,
  `DATE_INS` date NOT NULL,
  `NUM_PERMIS` varchar(45) COLLATE utf8mb3_unicode_ci NOT NULL,
  `DATE_RECRUT` date NOT NULL,
  `DATE_FIN` date DEFAULT NULL,
  `ETAT` varchar(10) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`NUMERO_ENREGISTREMENT`),
  KEY `FK_TRAVAIL` (`NUM_INS`,`DATE_INS`,`NUM_PERMIS`),
  CONSTRAINT `FK_TRAVAIL` FOREIGN KEY (`NUM_INS`, `DATE_INS`, `NUM_PERMIS`) REFERENCES `CANDIDAT` (`NUM_INS`, `DATE_INS`, `NUM_PERMIS`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_TRAVAIL2` FOREIGN KEY (`NUMERO_ENREGISTREMENT`) REFERENCES `OPERATEUR` (`NUMERO_ENREGISTREMENT`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `VEHICULE`
--

DROP TABLE IF EXISTS `VEHICULE`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VEHICULE` (
  `MATRECULE` varchar(10) COLLATE utf8mb3_unicode_ci NOT NULL,
  `NUMERO_ENREGISTREMENT` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `GENRE` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `MARQUE` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `PTC` decimal(10,3) DEFAULT NULL,
  `PTAC` decimal(10,3) DEFAULT NULL,
  `CU` decimal(10,3) DEFAULT NULL,
  `NOMBRE_PLACE` int DEFAULT NULL,
  PRIMARY KEY (`MATRECULE`),
  KEY `FK_APPARTIENT` (`NUMERO_ENREGISTREMENT`),
  CONSTRAINT `FK_APPARTIENT` FOREIGN KEY (`NUMERO_ENREGISTREMENT`) REFERENCES `OPERATEUR` (`NUMERO_ENREGISTREMENT`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `candidat`
--

DROP TABLE IF EXISTS `candidat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidat` (
  `NUM_INS` varchar(20) NOT NULL,
  `DATE_INS` date NOT NULL,
  `NOM_CANDIDAT` char(50) NOT NULL,
  `PRENOM_CANDIDAT` char(50) NOT NULL,
  `PRENOM_PERE` varchar(50) NOT NULL,
  `DATE_NAIS_CANDIDAT` date NOT NULL,
  `LIEU_NAIS_CANDIDAT` varchar(20) NOT NULL,
  `NIVEAU_SCOL_CANDIDAT` varchar(50) DEFAULT NULL,
  `ADRESSE_CANDIDAT` varchar(100) DEFAULT NULL,
  `SEX_CONDIDAT` char(10) DEFAULT NULL,
  `TYPE_CANDIDAT` varchar(20) DEFAULT NULL,
  `NUM_PERMIS` varchar(45) NOT NULL,
  `DATE_LIV_PERMIS` date DEFAULT NULL,
  `DATE_EXP_PERMIS` date DEFAULT NULL,
  `TYPE_PERMIS` varchar(50) DEFAULT NULL,
  `CATEGORIE_PERMIS` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`NUM_INS`,`DATE_INS`,`NUM_PERMIS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `centre`
--

DROP TABLE IF EXISTS `centre`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `centre` (
  `NUMERO_AGREMENT` varchar(50) NOT NULL,
  `NOM_CENTRE` varchar(50) DEFAULT NULL,
  `SIEGE` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`NUMERO_AGREMENT`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `direction`
--

DROP TABLE IF EXISTS `direction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direction` (
  `WILAYA` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `SERVICE` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`WILAYA`,`SERVICE`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `formation`
--

DROP TABLE IF EXISTS `formation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `formation` (
  `NUMERO_FORMATION` int NOT NULL,
  `GROUPE` int NOT NULL,
  `NUMERO_AGREMENT` varchar(50) NOT NULL,
  `TYPE_FORMATION` varchar(50) DEFAULT NULL,
  `DEBUT` date DEFAULT NULL,
  `FIN` date DEFAULT NULL,
  `TYPE_GROUPE` varchar(50) DEFAULT 'فوج عادي',
  PRIMARY KEY (`NUMERO_FORMATION`,`GROUPE`,`NUMERO_AGREMENT`),
  KEY `FK_OFFRE` (`NUMERO_AGREMENT`),
  CONSTRAINT `FK_OFFRE` FOREIGN KEY (`NUMERO_AGREMENT`) REFERENCES `centre` (`NUMERO_AGREMENT`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `passe`
--

DROP TABLE IF EXISTS `passe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passe` (
  `NUM_INS` varchar(20) NOT NULL,
  `DATE_INS` date NOT NULL,
  `NUM_PERMIS` varchar(45) NOT NULL,
  `NUMERO_FORMATION` int NOT NULL,
  `GROUPE` int NOT NULL,
  `NUMERO_AGREMENT` varchar(50) NOT NULL,
  `NOTE` float DEFAULT NULL,
  `REMARQUE` varchar(50) DEFAULT NULL,
  `BREVET` varchar(45) DEFAULT NULL,
  `LIV_BREVET` date DEFAULT NULL,
  `EXP_BREVET` date DEFAULT NULL,
  `PRINT` int DEFAULT '0',
  `DATE_EMISSION` date DEFAULT NULL,
  `NUMERO` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`NUM_INS`,`DATE_INS`,`NUM_PERMIS`,`NUMERO_FORMATION`,`GROUPE`,`NUMERO_AGREMENT`),
  KEY `FK_PASSE` (`NUMERO_FORMATION`),
  KEY `FK_PASSE3` (`NUMERO_FORMATION`,`GROUPE`,`NUMERO_AGREMENT`),
  CONSTRAINT `FK_PASSE2` FOREIGN KEY (`NUM_INS`, `DATE_INS`, `NUM_PERMIS`) REFERENCES `candidat` (`NUM_INS`, `DATE_INS`, `NUM_PERMIS`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_PASSE3` FOREIGN KEY (`NUMERO_FORMATION`, `GROUPE`, `NUMERO_AGREMENT`) REFERENCES `formation` (`NUMERO_FORMATION`, `GROUPE`, `NUMERO_AGREMENT`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `USERNAME` varchar(50) NOT NULL,
  `PASSWORD` varchar(250) NOT NULL,
  `ADMIN` varchar(10) NOT NULL,
  `NUMERO_AGREMENT` varchar(50) NOT NULL,
  PRIMARY KEY (`USERNAME`,`PASSWORD`,`ADMIN`),
  KEY `FK_CONTIENT` (`NUMERO_AGREMENT`),
  CONSTRAINT `FK_CONTIENT` FOREIGN KEY (`NUMERO_AGREMENT`) REFERENCES `centre` (`NUMERO_AGREMENT`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_direction`
--

DROP TABLE IF EXISTS `user_direction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_direction` (
  `USERNAME` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `WILAYA` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `SERVICE` varchar(50) COLLATE utf8mb3_unicode_ci NOT NULL,
  `PASSWORD` varchar(250) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `TYPE` varchar(20) COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`USERNAME`),
  KEY `FK_AVOIR` (`WILAYA`,`SERVICE`),
  CONSTRAINT `FK_AVOIR` FOREIGN KEY (`WILAYA`, `SERVICE`) REFERENCES `direction` (`WILAYA`, `SERVICE`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-12-04  7:06:54

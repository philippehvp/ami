-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : lun. 03 avr. 2023 à 22:03
-- Version du serveur : 8.0.30
-- Version de PHP : 8.0.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Base de données : `cpi`
--

-- --------------------------------------------------------

--
-- Structure de la table `bet`
--

CREATE TABLE `bet` (
  `better_id` int NOT NULL,
  `category_id` int NOT NULL,
  `winner_player_id` int DEFAULT NULL,
  `runnerUp_player_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `bet`
--

INSERT INTO `bet` (`better_id`, `category_id`, `winner_player_id`, `runnerUp_player_id`) VALUES
(7, 11, 11103, 11102),
(7, 12, 11201, 11203),
(7, 13, 11301, 11302),
(7, 21, 22102, 22103),
(7, 22, 22202, 22201),
(8, 11, 11101, 11103),
(8, 12, 11202, 11201),
(8, 13, 11301, 11303),
(8, 21, 22102, 22103),
(8, 22, 22201, 22202),
(8, 23, 22301, 22303),
(9, 11, NULL, NULL),
(9, 12, NULL, NULL),
(9, 13, NULL, NULL),
(9, 21, NULL, NULL),
(9, 22, NULL, NULL),
(9, 23, NULL, NULL),
(11, 11, NULL, NULL),
(11, 12, NULL, NULL),
(11, 13, NULL, NULL),
(11, 21, NULL, NULL),
(11, 22, NULL, NULL),
(11, 23, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `better`
--

CREATE TABLE `better` (
  `id` int NOT NULL,
  `name` varchar(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `club` varchar(32) NOT NULL,
  `isAdmin` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `better`
--

INSERT INTO `better` (`id`, `name`, `firstName`, `club`, `isAdmin`) VALUES
(7, 'Huynh Vinh Phat', 'Philippe', 'ISB', 0),
(8, 'Pueyo', 'Alexandre', 'ISB', 0),
(9, 'Hoyer', 'Maxime', 'SMUC', 0),
(11, 'Zoppis', 'Baptiste', 'ISB', 0);

-- --------------------------------------------------------

--
-- Structure de la table `betting`
--

CREATE TABLE `betting` (
  `better_id` int NOT NULL,
  `contest_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `betting`
--

INSERT INTO `betting` (`better_id`, `contest_id`) VALUES
(1, 1),
(1, 2),
(1, 3),
(2, 1),
(2, 2),
(2, 3),
(3, 1),
(3, 2),
(3, 3),
(4, 1),
(4, 2),
(4, 3),
(5, 1),
(5, 2),
(5, 3),
(6, 1),
(6, 2),
(6, 3),
(7, 1),
(7, 2),
(8, 1),
(8, 2),
(9, 1),
(9, 2),
(11, 1),
(11, 2);

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

CREATE TABLE `category` (
  `id` int NOT NULL,
  `shortName` varchar(2) NOT NULL,
  `longName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contest_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `shortName`, `longName`, `contest_id`) VALUES
(11, 'S1', 'Série 1', 1),
(12, 'S2', 'Série 2', 1),
(13, 'S3', 'Série 3', 1),
(21, 'S1', 'Série 1', 2),
(22, 'S2', 'Série 2', 2),
(23, 'S3', 'Série 3', 2),
(31, 'S1', 'Série 1', 3),
(32, 'S2', 'Série 2', 3),
(33, 'S3', 'Série 3', 3);

-- --------------------------------------------------------

--
-- Structure de la table `contest`
--

CREATE TABLE `contest` (
  `id` int NOT NULL,
  `shortName` varchar(2) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `longName` varchar(32) NOT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `day` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `contest`
--

INSERT INTO `contest` (`id`, `shortName`, `longName`, `startDate`, `endDate`, `day`) VALUES
(1, 'DH', 'Doubles Hommes', '2023-03-28', '2023-07-09', 1),
(2, 'DD', 'Doubles Dames', '2023-03-28', '2023-07-09', 1),
(3, 'DM', 'Doubles Mixtes', '2023-08-28', '2023-07-10', 2);

-- --------------------------------------------------------

--
-- Structure de la table `duration`
--

CREATE TABLE `duration` (
  `better_id` int NOT NULL,
  `contest_day` tinyint NOT NULL,
  `duration` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `duration`
--

INSERT INTO `duration` (`better_id`, `contest_day`, `duration`) VALUES
(8, 1, 50),
(9, 1, 0),
(11, 1, 0);

-- --------------------------------------------------------

--
-- Structure de la table `player`
--

CREATE TABLE `player` (
  `id` int NOT NULL,
  `playerName1` varchar(100) NOT NULL,
  `playerRanking1` varchar(3) NOT NULL,
  `playerName2` varchar(100) NOT NULL,
  `playerRanking2` varchar(3) NOT NULL,
  `category_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `player`
--

INSERT INTO `player` (`id`, `playerName1`, `playerRanking1`, `playerName2`, `playerRanking2`, `category_id`) VALUES
(11101, 'Quentin Lebon', '', 'Cédric Villedieu', '', 11),
(11102, 'Romain Stradi', '', 'Nathan Condomine', '', 11),
(11103, 'Jean Dupont', '', 'Pierre Martin', '', 11),
(11201, 'Eric Duchamp', '', 'Pascal Table', '', 12),
(11202, 'Corentin Chaise', '', 'Jean Nappe', '', 12),
(11203, 'Sylvain Rateau', '', 'Patrick Pioche', '', 12),
(11301, 'Alexandre Plafond', '', 'Mathieu Plancher', '', 13),
(11302, 'Henri Georges', '', 'Bruno Clavier', '', 13),
(11303, 'Stéphane Marion', '', 'Serge Souris', '', 13),
(22101, 'Isabelle Duhamel', '', 'Sandrine Joseph', '', 21),
(22102, 'Cindy Machin', '', 'Estelle Bidule', '', 21),
(22103, 'Patricia Truc', '', 'Corinne Chose', '', 21),
(22201, 'Célestine Beauté', '', 'Alexandrine Touche', '', 22),
(22202, 'Michèle Mabelle', '', 'Lucie Sissi', '', 22),
(22203, 'Joséphine Ange', '', 'Catherine Aqueduc', '', 22),
(22301, 'Véronique Plateau', '', 'Victorine Cheval', '', 23),
(22302, 'Julie Carton', '', 'Marcelle Cloche', '', 23),
(22303, 'Béatrice Chaussure', '', 'Georgette Huit', '', 23),
(33101, 'Amandine Arbre', '', 'Claire Sombre', '', 31),
(33102, 'Charlotte Fraise', '', 'Erika France', '', 31),
(33103, 'Céline Chapeau', '', 'Cécile Sourcil', '', 31),
(33201, 'Amélie Dumont', '', 'Eléonore Bague', '', 32),
(33202, 'Marguerite Fleur', '', 'Gisèle Pré', '', 32),
(33203, 'Adeline Magie', '', 'Véronique Chaise', '', 32),
(33301, 'Clémentine Fruit', '', 'Marjolaine Pierre', '', 33),
(33302, 'Séverine Sylvain', '', 'Coralie Lilly', '', 33),
(33303, 'Marcella Lala', '', 'Sylvie Seigle', '', 33);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bet`
--
ALTER TABLE `bet`
  ADD PRIMARY KEY (`better_id`,`category_id`);

--
-- Index pour la table `better`
--
ALTER TABLE `better`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `betting`
--
ALTER TABLE `betting`
  ADD PRIMARY KEY (`better_id`,`contest_id`);

--
-- Index pour la table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `contest`
--
ALTER TABLE `contest`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `duration`
--
ALTER TABLE `duration`
  ADD PRIMARY KEY (`better_id`,`contest_day`);

--
-- Index pour la table `player`
--
ALTER TABLE `player`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `better`
--
ALTER TABLE `better`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

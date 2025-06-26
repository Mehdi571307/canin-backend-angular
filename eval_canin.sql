-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 26 juin 2025 à 16:34
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `eval_canin`
--

-- --------------------------------------------------------

--
-- Structure de la table `chien`
--

DROP TABLE IF EXISTS `chien`;
CREATE TABLE IF NOT EXISTS `chien` (
  `id` int NOT NULL AUTO_INCREMENT,
  `race` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nom` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nom_image` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `utilisateur_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur_id` (`utilisateur_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `chien`
--

INSERT INTO `chien` (`id`, `race`, `nom`, `nom_image`, `description`, `utilisateur_id`) VALUES
(2, 'Labrador', 'Rex', NULL, 'Rex est un chien', 1),
(3, 'Caniche', 'Fifou', NULL, 'Petit chien', 1);

-- --------------------------------------------------------

--
-- Structure de la table `cours`
--

DROP TABLE IF EXISTS `cours`;
CREATE TABLE IF NOT EXISTS `cours` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `date_cours` datetime NOT NULL,
  `places_disponibles` int NOT NULL DEFAULT '0',
  `image_path` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `cours`
--

INSERT INTO `cours` (`id`, `nom`, `date_cours`, `places_disponibles`, `image_path`) VALUES
(5, 'École du chiot', '2025-07-07 11:00:00', 5, 'https://plus.unsplash.com/premium_photo-1666777247416-ee7a95235559?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE IF NOT EXISTS `utilisateur` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateur`
--

INSERT INTO `utilisateur` (`id`, `email`, `password`) VALUES
(1, 'toto@gmail.com', '$2b$10$Ja343mJurpQKAH/UUGRz7OjxWZSrqCTDTff1MZfXitrKiXEVjWQny');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

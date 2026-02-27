-- --------------------------------------------------------
-- Host:                         kingbarber.webhop.net
-- Versión del servidor:         8.0.45-0ubuntu0.22.04.1 - (Ubuntu)
-- SO del servidor:              Linux
-- HeidiSQL Versión:             12.14.0.7165
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para barber
CREATE DATABASE IF NOT EXISTS `barber` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `barber`;

-- Volcando estructura para tabla barber.barbero
CREATE TABLE IF NOT EXISTS `barbero` (
  `id_barbero` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `foto_url` varchar(255) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `descanso_inicio` varchar(10) DEFAULT NULL,
  `descanso_fin` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id_barbero`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla barber.barbero: ~2 rows (aproximadamente)
INSERT INTO `barbero` (`id_barbero`, `nombre`, `created_at`, `foto_url`, `activo`, `descanso_inicio`, `descanso_fin`) VALUES
	(1, 'Nacho', '2026-01-05 00:35:34', 'barbero_1_1771909885.jpeg', 1, '14:00', '14:15'),
	(3, 'Amilkar ', '2026-01-12 22:11:48', 'barbero_3_1771631691.jpg', 0, NULL, NULL);

-- Volcando estructura para tabla barber.barberos
CREATE TABLE IF NOT EXISTS `barberos` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'barbero',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `barbero_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ux_barberos_email` (`email`),
  KEY `fk_barberos_barbero` (`barbero_id`),
  CONSTRAINT `fk_barberos_barbero` FOREIGN KEY (`barbero_id`) REFERENCES `barbero` (`id_barbero`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla barber.barberos: ~0 rows (aproximadamente)
INSERT INTO `barberos` (`id`, `nombre`, `email`, `password_hash`, `role`, `is_active`, `barbero_id`) VALUES
	(1, 'Nacho', 'nacho@kingbarber.com', '$2b$12$WixmxQGqBKFCmK8REva6EuRLrP1QellMHs5PhU6e8KPd.QSmFg5Jm', 'admin', 1, 1);

-- Volcando estructura para tabla barber.blacklist
CREATE TABLE IF NOT EXISTS `blacklist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `telefono` varchar(20) NOT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `telefono_unico` (`telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla barber.blacklist: ~0 rows (aproximadamente)

-- Volcando estructura para tabla barber.cliente
CREATE TABLE IF NOT EXISTS `cliente` (
  `id_cliente` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `uq_cliente_telefono` (`telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla barber.cliente: ~96 rows (aproximadamente)
INSERT INTO `cliente` (`id_cliente`, `nombre`, `apellido`, `telefono`, `email`, `created_at`) VALUES
	(1, 'Matias', 'Perreng', '095064060', 'csmatiperreng@gmail.com', '2026-01-12 22:09:39'),
	(2, 'Leandro ', 'Estevez ', '096636052', 'leandroestevez18@gmail.com', '2026-01-13 20:48:40'),
	(3, 'Ezequiel', 'Montero', '095541214', 'monte24ro@gmail.com', '2026-01-14 02:40:48'),
	(4, 'Agustín', 'Calonge ', '092714524', 'agustincalonge8@gmail.com', '2026-01-14 02:50:56'),
	(5, 'Agustin', 'Mello', '097165801', 'agustinmello97@gmail.com', '2026-01-14 03:01:10'),
	(6, 'Diego ', 'Rodriguez', '094689077', 'diegomauricio1710@gmail.com', '2026-01-14 03:31:48'),
	(7, 'Sebastian', 'Olivera', '093703581', 'sebamanuo2710@gmail.com', '2026-01-14 04:17:24'),
	(8, 'franco ', 'king', '09999999', 'nicolasmedinab11@gmail.com', '2026-01-14 06:21:09'),
	(9, 'Gerard', 'Silva', '094728617', NULL, '2026-01-14 07:31:52'),
	(10, 'Dilan', 'Prado ', '094120793', 'dilanprado1104@gmail.com', '2026-01-14 08:44:29'),
	(11, 'Maicol', 'Borreg', '098454871', NULL, '2026-01-14 09:15:49'),
	(12, 'nelson', 'nieves', '092937412', 'conejo4882@gmail.com', '2026-01-14 09:34:54'),
	(13, 'Benjamín ', 'Peña', '093920081', 'santiagocardozo2000@icloud.com', '2026-01-14 09:54:50'),
	(14, 'Benjamín ', 'Peña', '095908606', 'santiagocardozo2000@icloud.com', '2026-01-14 09:56:53'),
	(15, 'Gaston', 'Martinez ', '095934867', 'jenico1610@gmail.com', '2026-01-14 10:37:53'),
	(16, 'Nacho', 'González ', '095900995', 'ignacio.galmiron@gmail.com', '2026-01-14 10:54:54'),
	(17, 'lucas', 'arismendi', '093820358', 'arismendilucas2006@gmail.com', '2026-01-14 11:54:30'),
	(18, 'Ignacio ', 'Saravia ', '099611465', 'ignaciosaravia1901@outlook.com', '2026-01-14 12:42:53'),
	(19, 'Pablo', 'Perez', '098475158', 'marcellordon4700@hotmail.com', '2026-01-14 13:28:18'),
	(20, 'Franco', 'Estevez', '096252500', 'estevezfranco12@gmail.com', '2026-01-14 15:39:49'),
	(21, 'Alexis', 'Villalba', '094023432', 'cabe-10@hotmail.com', '2026-01-14 23:55:08'),
	(22, 'Lucas ', 'Añon', '094122699', 'jonatahansanchez0@gmail.com', '2026-01-15 01:19:29'),
	(23, 'manu', 'vera', '094132749', 'manuvera1924@gmail.com', '2026-01-15 15:35:57'),
	(24, 'Alexis', 'Areosa', '099626627', 'aleareosa93@gmail.com', '2026-01-16 12:25:29'),
	(25, 'Carlos', 'Nieve', '094749449', NULL, '2026-01-16 22:37:11'),
	(26, 'Itan', 'Caceres', '093311302', NULL, '2026-01-17 01:04:52'),
	(28, 'nelson', 'nieves', '099589191', 'conejo2nieves@hotmail.com', '2026-01-18 10:35:03'),
	(29, 'Nicolas', 'Cruz', '095067544', 'nc07598@gmail.com', '2026-01-18 16:40:50'),
	(32, 'Ivan', 'Francia', '094388948', 'ivanfrancia2002@gmail.com', '2026-01-19 00:24:21'),
	(33, 'Nicolas', 'Cruz', '095067554', 'nc07598@gmail.com', '2026-01-20 03:39:00'),
	(34, 'Alfredo', 'Viera', '093705681', 'negrovieraa@gmail.com', '2026-01-20 12:54:46'),
	(35, 'Alex', 'olivera', '093350395', 'alexnahuelcolmanolivera@gmail.com', '2026-01-21 01:26:00'),
	(36, 'Bruno', 'Rosas', '092290441', 'brunorosas10@icloud.com', '2026-01-21 01:26:45'),
	(37, 'Car', 'Lo', '091696531', 'Carlosmatias857@gmail.com', '2026-01-21 01:26:56'),
	(38, 'Santiago', 'Garcia', '093758964', 'garciasantiago2201@gmail.com', '2026-01-21 01:38:37'),
	(39, 'Facundo', 'Duarte', '095194808', 'facuduarte2006@gmail.com', '2026-01-21 01:42:01'),
	(40, 'Nicolás ', 'Medina', '091041010', 'nicolasmedinab11@gmail.com', '2026-01-21 01:59:35'),
	(41, 'Cristian', 'Britos', '098510368', 'cristian.britos20@gmail.com', '2026-01-21 02:01:20'),
	(42, 'Gino', 'Marroche ', '094770894', 'gialessandro81@gmail.com', '2026-01-21 09:04:19'),
	(43, 'Fabrizio ', 'De Dominicis ', '094229162', 'linux3@hotmail.com.ar', '2026-01-21 11:53:55'),
	(44, 'Angel', 'Rodriguez ', '094656814', 'angel-_-gabelo@hotmail.com', '2026-01-21 12:35:17'),
	(45, 'Pablo', 'Mokarm', '097300739', 'pablomokarm@gmail.com', '2026-01-21 15:32:00'),
	(46, 'Thiago', 'Iglesias ', '093315166', 'thiagoiglesias2705@gmail.com', '2026-01-21 23:30:40'),
	(47, 'Santiago ', 'Queti', '092225777', 'ditchekeniansantiago@gmail.com', '2026-01-22 01:52:29'),
	(48, 'Edinson ', 'Noble ', '094908127', 'edinsonnoble7@gmail.com', '2026-01-22 13:00:35'),
	(49, 'Facundo', 'Galeano ', '098188340', 'galeano.facundo1922@icloud.com', '2026-01-22 16:54:15'),
	(50, 'Chino', 'Gutierrez', '099386984', 'facnicolas1922@outlook.com', '2026-01-22 18:10:03'),
	(51, 'Mathias', 'Alaniz', '091680511', 'bcfm.alaniz@gmail.com', '2026-01-22 22:16:06'),
	(52, 'Facundo', 'Barbero', '094732581', 'facubar2368@gmail.com', '2026-01-23 15:46:35'),
	(53, 'Andres', 'Braga', '094185382', 'andresbraga2018@gmail.com', '2026-02-07 01:06:42'),
	(54, 'Christian ', 'Bethencourt', '091622999', 'christianbethencourt1919@gmail.com', '2026-02-07 01:08:20'),
	(55, 'Jonathan ', 'Souza', '091279467', 'jonasouza276@gmail.com', '2026-02-07 01:26:55'),
	(56, 'Matías ', 'Pérez', '094964008', 'matii4570@gmail.com', '2026-02-07 02:10:55'),
	(57, 'Marcos', 'Galván ', '098342852', NULL, '2026-02-07 21:06:17'),
	(58, 'Ivan', 'Aguirre', '094463097', 'ivanandres2332@gmail.com', '2026-02-09 03:40:35'),
	(59, 'Alejandro ', 'Velazquez ', '094702642', 'alenegocios_cerro@hotmail.com', '2026-02-09 17:57:19'),
	(60, 'Leandro ', 'Estevez ', '096636952', 'leandroestevez18@gmail.com', '2026-02-09 19:55:51'),
	(61, 'Martin', 'Guevara ', '095497528', 'martinguevara994@gmail.com', '2026-02-09 22:06:58'),
	(62, 'Gonzalo', 'Otero', '094762305', 'oterogonzalo73@gmail.com', '2026-02-10 13:03:24'),
	(63, 'Lautaro ', 'Taleano', '098188349', NULL, '2026-02-11 22:34:35'),
	(64, 'Marcos ', 'Galván ', '098342952', 'marcosgalvan0816@gmail.com', '2026-02-11 22:50:33'),
	(65, 'Guillermo ', 'Ventoso ', '095717453', 'ventosog@gmail.com', '2026-02-12 19:40:28'),
	(66, 'Esteban ', 'Ortega ', '092298286', 'estebanortega1995810000@gmail.com', '2026-02-13 11:10:21'),
	(67, 'Santi', 'Jara', '093369253', 'jararamiro522@gmail.com', '2026-02-13 23:16:53'),
	(68, 'Ezequiel', 'Gomez', '092978644', 'monte34ro@gmail.com', '2026-02-16 00:37:56'),
	(69, 'Jonathan ', 'Gómez ', '099306084', 'Gigantee.23g@gmail.com', '2026-02-16 20:46:22'),
	(70, 'David ', 'Saravia ', '099611467', NULL, '2026-02-17 14:39:55'),
	(71, 'Héctor', 'Saravia', '092 961 927', 'hectorsaravia410@gmail.com', '2026-02-17 15:25:50'),
	(72, 'Leo', 'Trindade', '099861148', 'leitotrindade@gmail.com', '2026-02-17 16:38:03'),
	(73, 'Benja ', 'Buen ', '098564729', NULL, '2026-02-17 19:57:58'),
	(74, 'Jordan', 'Cortes', '092238680', 'jordancortescorrea98@gmail.com', '2026-02-18 09:02:11'),
	(75, 'Franco', 'Ramírez', '094678260', 'franco1999siu@gmail.com', '2026-02-19 00:42:37'),
	(76, 'Fernando ', 'Giles', '091860402', 'ffgiles81@gmail.com', '2026-02-19 09:56:37'),
	(77, 'Andrés ', 'Lefevre ', '095902749', 'andreslefevre9@gmail.com', '2026-02-19 12:53:17'),
	(78, 'Martin', 'Cerro', '091 716 746', 'martincerro121@gmail.com', '2026-02-20 16:18:25'),
	(79, 'Martin', 'Dos santos ', '091716746', 'cdratwa5@gmail.com', '2026-02-20 17:05:40'),
	(80, 'Ignacio ', 'Saravia', '099611466', NULL, '2026-02-20 17:14:41'),
	(81, 'Ismael ', 'Luzardo ', '092453046', 'ismmael1111@gmail.com', '2026-02-20 20:33:21'),
	(82, 'Prueba', 'Barber', '093910963', 'matiperreng2019@gmail.com', '2026-02-20 23:17:30'),
	(83, 'Matias', 'MonTh', '095064061', 'csmatiperreng@gmail.com', '2026-02-20 23:48:13'),
	(84, 'Lucas', 'Morales', '094404221', 'lucasmorales2417@gmail.com', '2026-02-21 00:47:33'),
	(85, 'Javier', 'Mora', '092802119', 'monte24ro@icloud.com', '2026-02-24 11:57:33'),
	(86, 'Joaco', 'Cardozo', '094153688', 'joacoemma1922@gmail.com', '2026-02-24 12:25:08'),
	(87, 'Facundo', 'Estevez', '096374628', 'facundoestevez13@gmail.com', '2026-02-24 12:57:44'),
	(88, 'Guillermo', 'Martinez', '095344765', 'guillemartinezavila0@gmail.com', '2026-02-24 13:38:24'),
	(89, 'Matias', 'Corajoria', '095570816', 'matiascorajoria@outlook.com', '2026-02-24 14:46:44'),
	(90, 'Agustin', 'Mello', '097165901', 'agustinmello97@gmail.com', '2026-02-25 03:13:33'),
	(91, 'Daniel', 'Michelli', '094176366', 'danielmichelli022@gmail.com', '2026-02-25 13:48:35'),
	(92, 'Benjamin', 'Quiroga', '092237859', 'bencap2015@gmail.com', '2026-02-25 14:44:51'),
	(93, 'Benjamin ', 'Romero', '093984626', 'romerosilvana438@gmail.com', '2026-02-25 15:54:35'),
	(94, 'Mati', 'perreng', '09623432', 'matiperreng2019@gmail.com', '2026-02-25 17:24:05'),
	(95, 'Ignacio ', 'Saravia ', '099611457', NULL, '2026-02-26 16:35:00'),
	(96, 'Juan', 'Franco', '093827125', 'juanfranco12281@gmail.com', '2026-02-26 18:50:02'),
	(97, 'Nahuel ', 'Anzalone ', '094679853', 'wahuelanzalone2004@gmail.com', '2026-02-27 13:08:36'),
	(98, 'manu', 'vera', '94132749', 'manuvera1924@gmail.com', '2026-02-27 13:33:39'),
	(99, 'Pepe', 'Prueba', '099888777', NULL, '2026-02-27 14:41:18'),
	(100, 'javier', 'mora', '097868290', 'javiermora23455@gmail.com', '2026-02-27 16:36:32'),
	(101, 'Seba ', 'Da Silva ', '091046616', 'dasilvafabio424@gmail.com', '2026-02-27 17:58:43'),
	(102, 'Gaston', 'Martinez', '654230974', 'jenico1610@gmail.com', '2026-02-27 21:03:03');

-- Volcando estructura para tabla barber.horario_barbero
CREATE TABLE IF NOT EXISTS `horario_barbero` (
  `id_horario` int unsigned NOT NULL AUTO_INCREMENT,
  `id_barbero` int unsigned NOT NULL,
  `dia_semana` tinyint NOT NULL COMMENT '1=Lunes ... 7=Domingo',
  `hora_desde` time NOT NULL,
  `hora_hasta` time NOT NULL,
  `fecha_desde` date NOT NULL,
  `fecha_hasta` date NOT NULL,
  PRIMARY KEY (`id_horario`),
  KEY `fk_horario_barbero` (`id_barbero`),
  CONSTRAINT `fk_horario_barbero` FOREIGN KEY (`id_barbero`) REFERENCES `barbero` (`id_barbero`) ON DELETE CASCADE,
  CONSTRAINT `chk_hora_valida` CHECK ((`hora_desde` < `hora_hasta`))
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla barber.horario_barbero: ~7 rows (aproximadamente)
INSERT INTO `horario_barbero` (`id_horario`, `id_barbero`, `dia_semana`, `hora_desde`, `hora_hasta`, `fecha_desde`, `fecha_hasta`) VALUES
	(13, 1, 6, '15:00:00', '20:20:00', '2026-02-07', '2026-02-15'),
	(14, 1, 1, '10:30:00', '19:00:00', '2026-02-16', '2027-01-01'),
	(16, 1, 3, '10:30:00', '19:00:00', '2026-02-18', '2027-01-03'),
	(18, 1, 5, '10:30:00', '19:00:00', '2026-02-20', '2027-01-05'),
	(19, 1, 6, '10:30:00', '19:00:00', '2026-02-21', '2027-01-06'),
	(21, 1, 2, '10:30:00', '17:00:00', '2026-02-24', '2026-03-01'),
	(22, 1, 4, '10:30:00', '19:00:00', '2026-02-19', '2027-01-04');

-- Volcando estructura para tabla barber.horario_excepcion
CREATE TABLE IF NOT EXISTS `horario_excepcion` (
  `id_excepcion` int NOT NULL AUTO_INCREMENT,
  `id_barbero` int unsigned NOT NULL,
  `fecha` date NOT NULL,
  `hora_desde` time DEFAULT NULL,
  `hora_hasta` time DEFAULT NULL,
  `tipo` enum('cierre','horario_especial') NOT NULL,
  PRIMARY KEY (`id_excepcion`),
  KEY `id_barbero` (`id_barbero`),
  CONSTRAINT `horario_excepcion_ibfk_1` FOREIGN KEY (`id_barbero`) REFERENCES `barbero` (`id_barbero`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla barber.horario_excepcion: ~0 rows (aproximadamente)

-- Volcando estructura para tabla barber.servicio
CREATE TABLE IF NOT EXISTS `servicio` (
  `id_servicio` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `duracion_min` int unsigned NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `imagen` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla barber.servicio: ~3 rows (aproximadamente)
INSERT INTO `servicio` (`id_servicio`, `nombre`, `duracion_min`, `precio`, `activo`, `imagen`) VALUES
	(1, 'Corte y cejas gratis', 45, 350.00, 1, '0a646127-ed2b-4f25-9c4e-cfe4975c22f0.jpg'),
	(2, 'Mechas y corte', 90, 1500.00, 1, 'e7b8fc01-4ab0-443a-a116-98683d0d968b.jpeg'),
	(3, 'Corte + Barba', 45, 400.00, 1, '636eff8a-e9c7-4f02-b9d0-11db74483127.jpg');

-- Volcando estructura para tabla barber.visita
CREATE TABLE IF NOT EXISTS `visita` (
  `id_visita` int unsigned NOT NULL AUTO_INCREMENT,
  `fecha_hora` datetime NOT NULL,
  `estado` enum('CONFIRMADO','CANCELADO','COMPLETADO') NOT NULL,
  `id_cliente` int unsigned NOT NULL,
  `id_barbero` int unsigned NOT NULL,
  `id_servicio` int unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `notificado_wsp` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_visita`),
  UNIQUE KEY `uk_barbero_fecha` (`id_barbero`,`fecha_hora`),
  KEY `fk_visita_cliente` (`id_cliente`),
  KEY `fk_visita_barbero` (`id_barbero`),
  KEY `fk_visita_servicio` (`id_servicio`),
  CONSTRAINT `fk_visita_barbero` FOREIGN KEY (`id_barbero`) REFERENCES `barbero` (`id_barbero`),
  CONSTRAINT `fk_visita_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`),
  CONSTRAINT `fk_visita_servicio` FOREIGN KEY (`id_servicio`) REFERENCES `servicio` (`id_servicio`)
) ENGINE=InnoDB AUTO_INCREMENT=296 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla barber.visita: ~195 rows (aproximadamente)
INSERT INTO `visita` (`id_visita`, `fecha_hora`, `estado`, `id_cliente`, `id_barbero`, `id_servicio`, `created_at`, `notificado_wsp`) VALUES
	(1, '2026-01-15 18:00:00', 'COMPLETADO', 2, 1, 1, '2026-01-13 20:48:40', 0),
	(2, '2026-01-17 10:00:00', 'COMPLETADO', 3, 1, 1, '2026-01-14 02:40:48', 0),
	(3, '2026-01-16 15:20:00', 'COMPLETADO', 4, 1, 1, '2026-01-14 02:50:56', 0),
	(4, '2026-01-14 11:30:00', 'COMPLETADO', 5, 1, 1, '2026-01-14 03:01:10', 0),
	(5, '2026-01-15 10:45:00', 'COMPLETADO', 6, 1, 1, '2026-01-14 03:31:49', 0),
	(6, '2026-01-14 13:00:00', 'COMPLETADO', 7, 1, 1, '2026-01-14 04:17:24', 0),
	(7, '2026-01-14 10:45:00', 'COMPLETADO', 8, 1, 3, '2026-01-14 06:21:09', 0),
	(8, '2026-01-16 10:45:00', 'COMPLETADO', 9, 1, 3, '2026-01-14 07:31:52', 0),
	(9, '2026-01-15 13:45:00', 'COMPLETADO', 10, 1, 3, '2026-01-14 08:44:29', 0),
	(10, '2026-01-16 17:30:00', 'COMPLETADO', 11, 1, 1, '2026-01-14 09:15:49', 0),
	(11, '2026-01-16 10:00:00', 'COMPLETADO', 12, 1, 1, '2026-01-14 09:34:54', 0),
	(12, '2026-01-14 12:15:00', 'COMPLETADO', 13, 1, 1, '2026-01-14 09:54:50', 0),
	(13, '2026-01-14 13:45:00', 'COMPLETADO', 14, 1, 1, '2026-01-14 09:56:54', 0),
	(14, '2026-01-16 16:45:00', 'COMPLETADO', 15, 1, 3, '2026-01-14 10:37:53', 0),
	(15, '2026-01-17 15:15:00', 'COMPLETADO', 16, 1, 1, '2026-01-14 10:54:54', 0),
	(16, '2026-01-15 10:00:00', 'COMPLETADO', 17, 1, 1, '2026-01-14 11:54:30', 0),
	(17, '2026-01-14 10:00:00', 'COMPLETADO', 18, 1, 1, '2026-01-14 12:42:53', 0),
	(18, '2026-01-14 17:30:00', 'COMPLETADO', 19, 1, 1, '2026-01-14 13:28:18', 0),
	(19, '2026-01-14 18:15:00', 'COMPLETADO', 2, 1, 1, '2026-01-14 14:39:16', 0),
	(20, '2026-01-15 11:30:00', 'COMPLETADO', 9, 1, 1, '2026-01-14 14:47:34', 0),
	(21, '2026-01-14 16:45:00', 'COMPLETADO', 20, 1, 1, '2026-01-14 15:39:49', 0),
	(23, '2026-01-16 18:15:00', 'COMPLETADO', 21, 1, 3, '2026-01-14 23:55:08', 0),
	(28, '2026-01-15 16:45:00', 'COMPLETADO', 22, 1, 3, '2026-01-15 01:19:29', 0),
	(31, '2026-01-15 16:00:00', 'COMPLETADO', 23, 1, 1, '2026-01-15 15:35:57', 0),
	(32, '2026-01-16 13:00:00', 'COMPLETADO', 24, 1, 3, '2026-01-16 12:25:29', 0),
	(33, '2026-01-17 12:15:00', 'COMPLETADO', 12, 1, 1, '2026-01-16 12:29:17', 0),
	(34, '2026-01-17 13:00:00', 'COMPLETADO', 12, 1, 1, '2026-01-16 12:29:35', 0),
	(35, '2026-01-19 10:00:00', 'COMPLETADO', 25, 1, 1, '2026-01-16 22:37:11', 1),
	(36, '2026-01-19 12:15:00', 'COMPLETADO', 12, 1, 1, '2026-01-16 23:03:20', 1),
	(37, '2026-01-19 13:00:00', 'COMPLETADO', 12, 1, 1, '2026-01-16 23:03:47', 1),
	(38, '2026-01-17 16:00:00', 'COMPLETADO', 26, 1, 1, '2026-01-17 01:04:52', 0),
	(41, '2026-01-19 10:45:00', 'COMPLETADO', 28, 1, 1, '2026-01-18 10:35:03', 1),
	(42, '2026-01-19 11:30:00', 'COMPLETADO', 28, 1, 1, '2026-01-18 10:35:45', 1),
	(43, '2026-01-20 15:15:00', 'COMPLETADO', 29, 1, 1, '2026-01-18 16:40:51', 1),
	(50, '2026-01-19 16:00:00', 'COMPLETADO', 32, 1, 1, '2026-01-19 00:24:21', 1),
	(54, '2026-01-20 10:00:00', 'COMPLETADO', 12, 1, 1, '2026-01-19 14:59:30', 1),
	(55, '2026-01-20 10:45:00', 'COMPLETADO', 8, 1, 1, '2026-01-19 14:59:43', 0),
	(56, '2026-01-20 11:30:00', 'COMPLETADO', 12, 1, 1, '2026-01-20 01:07:24', 1),
	(57, '2026-01-20 13:00:00', 'COMPLETADO', 33, 1, 1, '2026-01-20 03:39:00', 1),
	(58, '2026-01-24 10:00:00', 'COMPLETADO', 34, 1, 3, '2026-01-20 12:54:46', 1),
	(59, '2026-01-20 16:00:00', 'COMPLETADO', 32, 1, 1, '2026-01-20 13:49:55', 1),
	(60, '2026-01-23 16:45:00', 'COMPLETADO', 15, 1, 2, '2026-01-20 18:49:24', 1),
	(61, '2026-01-21 10:45:00', 'COMPLETADO', 35, 1, 1, '2026-01-21 01:26:01', 1),
	(62, '2026-01-23 18:15:00', 'COMPLETADO', 36, 1, 1, '2026-01-21 01:26:45', 1),
	(63, '2026-01-21 15:15:00', 'COMPLETADO', 37, 1, 1, '2026-01-21 01:26:56', 1),
	(64, '2026-01-21 12:15:00', 'COMPLETADO', 9, 1, 1, '2026-01-21 01:35:27', 1),
	(65, '2026-01-22 10:45:00', 'COMPLETADO', 38, 1, 1, '2026-01-21 01:38:37', 1),
	(66, '2026-01-21 17:30:00', 'COMPLETADO', 39, 1, 1, '2026-01-21 01:42:01', 1),
	(67, '2026-01-23 15:15:00', 'COMPLETADO', 4, 1, 1, '2026-01-21 01:43:29', 1),
	(68, '2026-01-21 16:45:00', 'COMPLETADO', 21, 1, 3, '2026-01-21 01:46:38', 1),
	(69, '2026-01-22 17:30:00', 'COMPLETADO', 40, 1, 1, '2026-01-21 01:59:35', 1),
	(70, '2026-01-21 13:00:00', 'COMPLETADO', 41, 1, 3, '2026-01-21 02:01:20', 1),
	(71, '2026-01-22 13:00:00', 'COMPLETADO', 10, 1, 3, '2026-01-21 02:01:27', 1),
	(72, '2026-01-22 16:45:00', 'COMPLETADO', 8, 1, 1, '2026-01-21 02:19:17', 0),
	(73, '2026-01-24 10:45:00', 'COMPLETADO', 42, 1, 3, '2026-01-21 09:04:19', 1),
	(74, '2026-01-24 11:30:00', 'COMPLETADO', 43, 1, 3, '2026-01-21 11:53:55', 1),
	(75, '2026-01-21 18:15:00', 'COMPLETADO', 44, 1, 1, '2026-01-21 12:35:18', 1),
	(76, '2026-01-21 10:00:00', 'COMPLETADO', 18, 1, 1, '2026-01-21 12:36:06', 1),
	(77, '2026-01-24 13:00:00', 'COMPLETADO', 11, 1, 1, '2026-01-21 14:25:28', 1),
	(78, '2026-01-21 16:00:00', 'COMPLETADO', 45, 1, 3, '2026-01-21 15:32:00', 1),
	(79, '2026-01-22 11:30:00', 'COMPLETADO', 5, 1, 1, '2026-01-21 15:59:47', 1),
	(81, '2026-01-24 15:15:00', 'COMPLETADO', 46, 1, 1, '2026-01-21 23:30:40', 1),
	(82, '2026-01-22 15:15:00', 'COMPLETADO', 47, 1, 3, '2026-01-22 01:52:29', 1),
	(83, '2026-01-22 10:00:00', 'COMPLETADO', 18, 1, 1, '2026-01-22 12:33:08', 1),
	(84, '2026-01-23 16:00:00', 'COMPLETADO', 48, 1, 3, '2026-01-22 13:00:35', 1),
	(85, '2026-01-24 16:00:00', 'COMPLETADO', 16, 1, 1, '2026-01-22 15:47:48', 1),
	(86, '2026-01-23 13:00:00', 'COMPLETADO', 49, 1, 1, '2026-01-22 16:54:15', 1),
	(87, '2026-01-24 12:15:00', 'COMPLETADO', 17, 1, 1, '2026-01-22 17:27:21', 1),
	(88, '2026-01-22 16:00:00', 'COMPLETADO', 18, 1, 1, '2026-01-22 18:08:38', 1),
	(89, '2026-01-22 18:15:00', 'COMPLETADO', 50, 1, 1, '2026-01-22 18:10:03', 1),
	(90, '2026-01-24 16:45:00', 'COMPLETADO', 51, 1, 1, '2026-01-22 22:16:06', 1),
	(92, '2026-01-23 10:00:00', 'COMPLETADO', 23, 1, 1, '2026-01-22 23:19:08', 1),
	(94, '2026-01-26 18:15:00', 'COMPLETADO', 2, 1, 1, '2026-01-23 14:07:20', 1),
	(95, '2026-01-23 11:30:00', 'COMPLETADO', 18, 1, 1, '2026-01-23 14:20:48', 1),
	(96, '2026-01-23 12:15:00', 'COMPLETADO', 18, 1, 1, '2026-01-23 14:21:14', 1),
	(97, '2026-01-24 18:15:00', 'COMPLETADO', 2, 1, 1, '2026-01-23 14:36:46', 1),
	(98, '2026-01-24 17:30:00', 'COMPLETADO', 52, 1, 1, '2026-01-23 15:46:35', 1),
	(99, '2026-01-26 15:15:00', 'COMPLETADO', 7, 1, 1, '2026-01-24 00:16:36', 1),
	(100, '2026-01-26 16:00:00', 'COMPLETADO', 7, 1, 1, '2026-01-24 00:17:19', 1),
	(103, '2026-02-07 16:30:00', 'COMPLETADO', 18, 1, 1, '2026-02-07 01:02:07', 1),
	(104, '2026-02-07 15:45:00', 'COMPLETADO', 16, 1, 1, '2026-02-07 01:05:37', 1),
	(105, '2026-02-07 18:00:00', 'COMPLETADO', 53, 1, 1, '2026-02-07 01:06:42', 1),
	(106, '2026-02-07 15:00:00', 'COMPLETADO', 54, 1, 1, '2026-02-07 01:08:21', 1),
	(107, '2026-02-09 16:30:00', 'COMPLETADO', 12, 1, 1, '2026-02-07 01:10:49', 1),
	(108, '2026-02-07 17:15:00', 'COMPLETADO', 55, 1, 1, '2026-02-07 01:26:55', 1),
	(109, '2026-02-13 18:45:00', 'COMPLETADO', 1, 1, 1, '2026-02-07 01:34:18', 1),
	(110, '2026-02-07 18:45:00', 'COMPLETADO', 56, 1, 2, '2026-02-07 02:10:55', 1),
	(111, '2026-02-09 17:15:00', 'COMPLETADO', 6, 1, 1, '2026-02-07 12:49:25', 1),
	(112, '2026-02-09 15:45:00', 'COMPLETADO', 57, 1, 1, '2026-02-07 21:06:17', 1),
	(113, '2026-02-10 15:00:00', 'COMPLETADO', 7, 1, 1, '2026-02-09 01:35:21', 1),
	(114, '2026-02-10 15:45:00', 'COMPLETADO', 7, 1, 1, '2026-02-09 01:35:59', 1),
	(115, '2026-02-14 15:00:00', 'COMPLETADO', 58, 1, 1, '2026-02-09 03:40:35', 1),
	(116, '2026-02-09 15:00:00', 'COMPLETADO', 18, 1, 1, '2026-02-09 13:06:22', 1),
	(117, '2026-02-10 16:30:00', 'COMPLETADO', 59, 1, 1, '2026-02-09 17:57:19', 1),
	(118, '2026-02-12 18:45:00', 'COMPLETADO', 60, 1, 1, '2026-02-09 19:55:52', 1),
	(119, '2026-02-13 17:15:00', 'COMPLETADO', 15, 1, 3, '2026-02-09 21:35:06', 1),
	(120, '2026-02-10 17:15:00', 'COMPLETADO', 61, 1, 2, '2026-02-09 22:06:59', 1),
	(121, '2026-02-13 15:00:00', 'COMPLETADO', 34, 1, 1, '2026-02-10 02:58:46', 1),
	(122, '2026-02-10 18:45:00', 'COMPLETADO', 36, 1, 1, '2026-02-10 09:39:21', 1),
	(123, '2026-02-10 19:30:00', 'CANCELADO', 62, 1, 3, '2026-02-10 13:03:24', 0),
	(124, '2026-02-13 18:00:00', 'COMPLETADO', 19, 1, 1, '2026-02-10 16:16:26', 1),
	(125, '2026-02-11 15:00:00', 'COMPLETADO', 4, 1, 1, '2026-02-10 16:40:38', 1),
	(126, '2026-02-14 17:15:00', 'COMPLETADO', 36, 1, 1, '2026-02-10 16:53:27', 1),
	(127, '2026-02-14 15:45:00', 'COMPLETADO', 43, 1, 3, '2026-02-10 17:33:39', 1),
	(128, '2026-02-11 19:30:00', 'COMPLETADO', 41, 1, 3, '2026-02-11 02:54:39', 1),
	(129, '2026-02-16 15:00:00', 'COMPLETADO', 6, 1, 1, '2026-02-11 03:25:25', 1),
	(130, '2026-02-13 15:45:00', 'COMPLETADO', 17, 1, 1, '2026-02-11 05:23:41', 1),
	(131, '2026-02-11 15:45:00', 'COMPLETADO', 49, 1, 1, '2026-02-11 11:54:09', 1),
	(132, '2026-02-11 18:00:00', 'COMPLETADO', 5, 1, 1, '2026-02-11 14:42:31', 1),
	(133, '2026-02-11 18:45:00', 'COMPLETADO', 18, 1, 1, '2026-02-11 16:01:00', 1),
	(134, '2026-02-20 15:00:00', 'COMPLETADO', 11, 1, 1, '2026-02-11 19:49:59', 1),
	(135, '2026-02-12 15:00:00', 'COMPLETADO', 63, 1, 1, '2026-02-11 22:34:35', 1),
	(136, '2026-02-13 16:30:00', 'COMPLETADO', 64, 1, 1, '2026-02-11 22:50:33', 1),
	(137, '2026-02-14 16:30:00', 'COMPLETADO', 48, 1, 3, '2026-02-11 23:24:33', 1),
	(138, '2026-02-12 16:30:00', 'COMPLETADO', 59, 1, 1, '2026-02-12 02:02:47', 1),
	(139, '2026-02-14 18:00:00', 'COMPLETADO', 16, 1, 1, '2026-02-12 17:14:25', 1),
	(140, '2026-02-12 19:30:00', 'COMPLETADO', 65, 1, 1, '2026-02-12 19:40:28', 1),
	(141, '2026-02-13 19:30:00', 'COMPLETADO', 46, 1, 1, '2026-02-12 19:56:47', 1),
	(142, '2026-02-14 18:45:00', 'COMPLETADO', 53, 1, 1, '2026-02-12 22:10:12', 1),
	(143, '2026-02-19 17:15:00', 'COMPLETADO', 8, 1, 1, '2026-02-13 00:19:02', 0),
	(144, '2026-02-16 15:45:00', 'COMPLETADO', 66, 1, 3, '2026-02-13 11:10:21', 1),
	(145, '2026-02-14 19:30:00', 'COMPLETADO', 67, 1, 1, '2026-02-13 23:16:53', 1),
	(146, '2026-02-17 15:00:00', 'COMPLETADO', 21, 1, 3, '2026-02-16 00:07:07', 1),
	(147, '2026-02-16 10:30:00', 'COMPLETADO', 68, 1, 1, '2026-02-16 00:37:56', 1),
	(148, '2026-02-21 11:15:00', 'COMPLETADO', 35, 1, 1, '2026-02-16 03:24:56', 1),
	(149, '2026-02-18 12:00:00', 'COMPLETADO', 5, 1, 1, '2026-02-16 15:09:54', 1),
	(150, '2026-02-20 17:15:00', 'COMPLETADO', 36, 1, 1, '2026-02-16 15:36:07', 1),
	(151, '2026-02-16 16:30:00', 'COMPLETADO', 50, 1, 1, '2026-02-16 18:20:33', 1),
	(152, '2026-02-17 16:30:00', 'COMPLETADO', 35, 1, 1, '2026-02-16 19:55:21', 1),
	(154, '2026-02-16 18:00:00', 'COMPLETADO', 69, 1, 3, '2026-02-16 20:46:22', 1),
	(156, '2026-02-21 12:45:00', 'COMPLETADO', 17, 1, 1, '2026-02-16 22:31:02', 1),
	(157, '2026-02-17 12:45:00', 'COMPLETADO', 5, 1, 1, '2026-02-17 05:25:45', 1),
	(158, '2026-02-17 10:30:00', 'COMPLETADO', 18, 1, 1, '2026-02-17 13:15:31', 1),
	(159, '2026-02-17 11:15:00', 'COMPLETADO', 18, 1, 1, '2026-02-17 13:15:56', 1),
	(160, '2026-02-17 12:00:00', 'COMPLETADO', 70, 1, 1, '2026-02-17 14:39:55', 1),
	(161, '2026-02-20 16:30:00', 'COMPLETADO', 12, 1, 1, '2026-02-17 14:54:28', 1),
	(162, '2026-02-17 17:15:00', 'COMPLETADO', 71, 1, 1, '2026-02-17 15:25:50', 1),
	(163, '2026-02-17 15:45:00', 'COMPLETADO', 72, 1, 3, '2026-02-17 16:38:03', 1),
	(164, '2026-02-17 18:00:00', 'COMPLETADO', 73, 1, 1, '2026-02-17 19:57:58', 1),
	(165, '2026-02-21 15:00:00', 'COMPLETADO', 1, 1, 2, '2026-02-17 20:31:45', 1),
	(166, '2026-02-21 17:15:00', 'COMPLETADO', 8, 1, 1, '2026-02-17 21:21:41', 0),
	(167, '2026-02-20 18:00:00', 'CANCELADO', 74, 1, 3, '2026-02-18 09:02:11', 0),
	(168, '2026-02-18 10:30:00', 'COMPLETADO', 18, 1, 1, '2026-02-18 13:21:17', 1),
	(169, '2026-02-21 16:30:00', 'COMPLETADO', 24, 1, 3, '2026-02-18 21:05:40', 1),
	(170, '2026-02-20 12:45:00', 'CANCELADO', 29, 1, 1, '2026-02-19 00:29:53', 1),
	(171, '2026-02-19 13:15:00', 'COMPLETADO', 75, 1, 1, '2026-02-19 00:42:38', 1),
	(172, '2026-02-21 10:30:00', 'COMPLETADO', 64, 1, 1, '2026-02-19 02:08:55', 1),
	(173, '2026-02-20 10:30:00', 'COMPLETADO', 19, 1, 1, '2026-02-19 03:55:48', 1),
	(174, '2026-02-19 12:30:00', 'COMPLETADO', 29, 1, 1, '2026-02-19 04:10:24', 1),
	(175, '2026-02-19 11:45:00', 'CANCELADO', 76, 1, 3, '2026-02-19 09:56:37', 0),
	(176, '2026-02-20 15:45:00', 'COMPLETADO', 76, 1, 3, '2026-02-19 10:32:56', 1),
	(177, '2026-02-26 12:30:00', 'COMPLETADO', 77, 1, 3, '2026-02-19 12:53:17', 1),
	(178, '2026-02-19 10:15:00', 'COMPLETADO', 18, 1, 1, '2026-02-19 13:11:26', 1),
	(179, '2026-02-21 12:00:00', 'COMPLETADO', 43, 1, 3, '2026-02-19 14:03:26', 1),
	(180, '2026-02-21 18:00:00', 'COMPLETADO', 8, 1, 1, '2026-02-19 18:42:18', 0),
	(181, '2026-02-20 11:15:00', 'COMPLETADO', 15, 1, 3, '2026-02-20 11:50:02', 1),
	(182, '2026-02-20 12:00:00', 'COMPLETADO', 18, 1, 1, '2026-02-20 13:52:20', 1),
	(202, '2026-02-23 15:00:00', 'COMPLETADO', 81, 1, 1, '2026-02-20 20:33:21', 1),
	(213, '2026-02-26 11:00:00', 'COMPLETADO', 84, 1, 1, '2026-02-21 00:47:33', 1),
	(214, '2026-02-27 17:15:00', 'COMPLETADO', 8, 1, 1, '2026-02-21 20:25:28', 1),
	(215, '2026-02-23 18:00:00', 'COMPLETADO', 45, 1, 3, '2026-02-22 23:02:30', 1),
	(216, '2026-02-24 10:30:00', 'COMPLETADO', 8, 1, 1, '2026-02-24 10:43:10', 0),
	(217, '2026-02-24 11:15:00', 'COMPLETADO', 8, 1, 1, '2026-02-24 10:43:31', 0),
	(218, '2026-02-27 15:45:00', 'COMPLETADO', 4, 1, 1, '2026-02-24 11:16:12', 1),
	(219, '2026-02-25 15:00:00', 'COMPLETADO', 7, 1, 1, '2026-02-24 11:20:16', 1),
	(220, '2026-02-25 15:45:00', 'COMPLETADO', 7, 1, 1, '2026-02-24 11:20:54', 1),
	(221, '2026-02-27 10:30:00', 'COMPLETADO', 85, 1, 1, '2026-02-24 11:57:33', 1),
	(222, '2026-02-25 18:00:00', 'COMPLETADO', 45, 1, 3, '2026-02-24 12:11:22', 1),
	(223, '2026-02-26 16:30:00', 'COMPLETADO', 12, 1, 1, '2026-02-24 12:13:52', 1),
	(224, '2026-02-24 12:00:00', 'COMPLETADO', 86, 1, 1, '2026-02-24 12:25:08', 1),
	(225, '2026-02-24 12:45:00', 'COMPLETADO', 72, 1, 3, '2026-02-24 12:30:06', 1),
	(226, '2026-02-28 10:30:00', 'CONFIRMADO', 8, 1, 1, '2026-02-24 12:40:36', 0),
	(227, '2026-02-24 15:00:00', 'COMPLETADO', 20, 1, 1, '2026-02-24 12:45:52', 1),
	(228, '2026-02-28 11:15:00', 'CONFIRMADO', 43, 1, 3, '2026-02-24 12:50:21', 0),
	(229, '2026-02-27 11:15:00', 'COMPLETADO', 87, 1, 1, '2026-02-24 12:57:44', 1),
	(230, '2026-02-26 17:15:00', 'COMPLETADO', 49, 1, 1, '2026-02-24 13:18:36', 1),
	(231, '2026-02-28 15:00:00', 'CONFIRMADO', 88, 1, 2, '2026-02-24 13:38:24', 0),
	(232, '2026-02-27 15:00:00', 'COMPLETADO', 2, 1, 1, '2026-02-24 13:59:48', 1),
	(233, '2026-02-26 18:00:00', 'COMPLETADO', 32, 1, 1, '2026-02-24 14:05:40', 1),
	(234, '2026-02-25 10:30:00', 'COMPLETADO', 89, 1, 1, '2026-02-24 14:46:44', 1),
	(235, '2026-02-24 15:45:00', 'COMPLETADO', 19, 1, 1, '2026-02-24 15:01:26', 1),
	(236, '2026-02-28 12:00:00', 'CONFIRMADO', 46, 1, 1, '2026-02-24 18:18:15', 0),
	(238, '2026-02-25 11:15:00', 'COMPLETADO', 90, 1, 1, '2026-02-25 03:13:33', 1),
	(239, '2026-02-27 12:45:00', 'COMPLETADO', 91, 1, 1, '2026-02-25 13:48:35', 1),
	(240, '2026-02-25 12:00:00', 'COMPLETADO', 92, 1, 1, '2026-02-25 14:44:51', 1),
	(241, '2026-02-25 17:15:00', 'COMPLETADO', 6, 1, 1, '2026-02-25 15:33:55', 1),
	(242, '2026-02-27 18:00:00', 'CONFIRMADO', 36, 1, 1, '2026-02-25 15:35:08', 1),
	(243, '2026-02-28 17:15:00', 'CONFIRMADO', 93, 1, 1, '2026-02-25 15:54:35', 0),
	(244, '2026-02-27 16:30:00', 'COMPLETADO', 16, 1, 1, '2026-02-25 16:17:15', 1),
	(245, '2026-02-26 15:45:00', 'COMPLETADO', 20, 1, 1, '2026-02-25 17:23:12', 1),
	(248, '2026-03-02 10:30:00', 'CONFIRMADO', 85, 1, 1, '2026-02-26 00:06:43', 0),
	(249, '2026-03-02 11:15:00', 'CONFIRMADO', 85, 1, 1, '2026-02-26 00:07:22', 0),
	(250, '2026-02-27 12:00:00', 'COMPLETADO', 11, 1, 1, '2026-02-26 01:54:05', 1),
	(251, '2026-02-26 14:15:00', 'COMPLETADO', 18, 1, 1, '2026-02-26 16:34:41', 1),
	(252, '2026-02-26 15:00:00', 'COMPLETADO', 95, 1, 1, '2026-02-26 16:35:00', 1),
	(253, '2026-02-27 14:15:00', 'CANCELADO', 64, 1, 1, '2026-02-26 18:44:10', 0),
	(254, '2026-02-28 12:45:00', 'CONFIRMADO', 64, 1, 1, '2026-02-26 18:45:40', 0),
	(255, '2026-02-28 14:15:00', 'CANCELADO', 96, 1, 1, '2026-02-26 18:50:02', 0),
	(256, '2026-02-28 16:30:00', 'CONFIRMADO', 64, 1, 1, '2026-02-26 18:53:42', 0),
	(257, '2026-02-28 18:00:00', 'CONFIRMADO', 39, 1, 1, '2026-02-26 22:57:23', 0),
	(285, '2026-03-02 12:00:00', 'CONFIRMADO', 100, 1, 1, '2026-02-27 16:36:32', 0),
	(292, '2026-03-02 15:00:00', 'CONFIRMADO', 101, 1, 1, '2026-02-27 17:58:43', 0);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

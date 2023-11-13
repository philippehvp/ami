-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: istresspruisb.mysql.db
-- Generation Time: Jul 10, 2023 at 11:20 PM
-- Server version: 5.7.42-log
-- PHP Version: 8.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `istresspruisb`
--

-- --------------------------------------------------------

--
-- Table structure for table `cpi_better`
--

CREATE TABLE `cpi_better` (
  `id` int(11) NOT NULL,
  `password` varchar(4) NOT NULL,
  `name` varchar(100) NOT NULL,
  `firstName` varchar(100) NOT NULL,
  `contact` varchar(255) NOT NULL,
  `club` varchar(100) NOT NULL,
  `isAdmin` smallint(6) NOT NULL,
  `accessKey` varchar(500) DEFAULT NULL,
  `randomKey` varchar(500) NOT NULL,
  `endAccessKeyValidityDate` datetime DEFAULT NULL,
  `isTutorialDone` smallint(6) NOT NULL DEFAULT '0',
  `evaluation` smallint(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `cpi_better`
--

INSERT INTO `cpi_better` (`id`, `password`, `name`, `firstName`, `contact`, `club`, `isAdmin`, `accessKey`, `randomKey`, `endAccessKeyValidityDate`, `isTutorialDone`, `evaluation`) VALUES
(1, '1809', 'Admin13800', 'Admin', 'Admin', '', 1, '$2y$10$iGspRjoDZ9fjG3zFzWGD9eI9ZTvGd60R9KvuGsPDpY.kR2W03.DWW', '$2y$10$5L4zbpBEYsadyZgYSZtyGeRh2CkM9M6h2re4/OVir43f5GwGt4vFm', '2023-07-10 20:43:00', 1, 5),
(14, '2203', 'PUEYO', 'Alexandre', 'alexandrepueyo@hotmail.com', '', 0, '$2y$10$JhYDybmc/O1ChUa41xFQKet1Tc0xPvOr1T3Eaue10YobXu8DpwqwC', '$2y$10$628AC4mwIOYL7atA8/gBp.75pDp9G0/Two.MKxx7kz3WwGZqE8iBu', '2023-07-09 23:36:39', 1, -1),
(15, '1203', 'HVP', 'Philippe', 'M', 'ISB', 0, '$2y$10$sOhnLLiZa30q/Doc5EGPl.f.ZSIsUFqZ1M7YbvbnX2k2IMKvbC6aO', '$2y$10$nRs2QgXensQvreq36zTDSu0S/sHI.Mn5YnUhV2LBmUT.4vrVs9gla', '2023-07-10 20:15:56', 1, -1),
(18, '0811', 'LOPEZ', 'Fabien', '0613547678', 'Badminton Pignan ', 0, '$2y$10$TXJs9PL.7r0O1YMHwFdzUuUv5bbSr6dUK1f7izOSXxkfoHfrw2bmy', '$2y$10$BWtGFLhdi1P.RP99ZOWDG..UqAnUvVKa9tME4NZXRtuBchikAl5QO', '2023-07-10 16:38:10', 1, 5),
(20, '1812', 'GAZEAU', 'Axel', 'axegazeau@gmail.com', '', 0, '$2y$10$aVt.Lvaq60Cqg77eh/lxOOv89ZSVTCx871IC0NwnmTfWXsfM.YfBa', '$2y$10$cYm.WLl6a/IL2mP.ZD9QE.R9N0PHT9WwJnNsab0GtfciYLKx2FFh.', '2023-07-09 07:03:52', 1, -1),
(21, '0511', 'PUGINIER', 'Kellian', '+33781639836', 'SGSCB34', 0, '$2y$10$z4RET0OpKTr8.exRAqIHCecFpTe7bSwdqJqXR.bAo6AG5aXKu4pWC', '$2y$10$GxBzNO98VCGBWKeXlAxSeeNB5GaSniqwTFbzQSmqRhwvb1A9T91N2', '2023-07-09 11:49:08', 1, -1),
(22, '1212', 'BARTOLO', 'Romain', '0789093857', 'Antibes', 0, '$2y$10$KLFznRFG8iWaiab/BKGBGOLZ9gh0h3/2KP//bU6ybBs1GQ43fohMW', '$2y$10$QWkph2LN3ApTdksFWRIAKO/tvqI2VYYyCQ4WiGfHdHWX8dWi/EeJu', '2023-07-10 19:34:39', 1, 5),
(23, '6844', 'ALBIN', 'Virginie', '0619916844', '', 0, '$2y$10$4SAhH9cmZbGTpWdUB7PkC.5AQJ1ppOXxoMxFWWpISa/bbl1wMCpvi', '$2y$10$pu/tjFiwi7VmLQJrJu0JYeXA7bNSpurUDVNBKpJxF7XSikyYTXFCW', '2023-07-09 16:34:53', 1, -1),
(24, '1702', 'LAUNOY', 'Claire', 'launoyclaire@hotmail.fr', 'ABIL', 0, '$2y$10$qWSwLJzNljwXsbpjRCfIUOcu8Of/RQFbVWA23G7FERpk5rAwHUO3y', '$2y$10$cIpiTgj6Z.xGLF6s8yHgPOrUdhQMODazCsrSvhlrW4gqIh0jszfRm', '2023-07-09 21:29:33', 1, -1),
(25, '2204', 'HAY', 'Florian', 'florian.hay@sfr.fr', 'Briançon ', 0, '$2y$10$dZK8UNOpP/9hUgmMxsDGCOtSpxYUzXG8S4Y9fOHieQ5x7bfEXhzOK', '$2y$10$4XclLxEDeDBQ77UkvcfFHevzkUvg1AV06r1Tdrkt19ORECWbQUT1K', '2023-07-09 23:15:59', 1, 5),
(26, '2309', 'TERRASSON', 'julien', '0664229559', 'UMS', 0, '$2y$10$R.6deZN65PS3O3hZJmn60eXY1im3gdP2l1wF59MI0XL72iDTJzfIC', '$2y$10$zxzrqWULQoksc9jKAVlKcun8670BmjTAGe7mi2Tg/qLRjAVnxGG1u', '2023-07-10 11:03:50', 1, 5),
(27, '1704', 'BONAVENTURA', 'Didier', '0649121705', '', 0, '$2y$10$TzUE.sCtN4Tw3k6AAfDj1.QQP2ZS78GuoAVS3ZJYE7mHThPj/rSbm', '$2y$10$heVoffFKdB2nt7SrD./zXeZcx8SQVjp8tXf2jp6tOH0z965HF.tfK', '2023-07-09 19:49:20', 1, -1),
(28, '7412', 'DECORPS', 'Alex', '0616864303', '', 0, '$2y$10$BtIkEHfuzETPQTa9fcBVceptaBiWi/UgYIaS3XQWlnlDm5.50EpTG', '$2y$10$qvvqXbvoYjwL8jz6.4ZGiee2gLR52IB7CBCnqxXNDjEuLBdrxBrVS', '2023-07-09 14:23:09', 1, 5),
(29, '4713', 'LEBON', 'Quentin ', 'moutarde13@live.fr', 'Isb', 0, '$2y$10$BHZIbU68kIpGPyBibpPhlOSDIs5JbYCTvBTinPgQipNSYVm8AbX0C', '$2y$10$xzb9o1141WSfEbzBFZVxt.Hy8advPS4QFlOx8L6I.fEHhLSg38aCa', '2023-07-08 10:33:41', 1, 5),
(30, '1005', 'ZOPPIS', 'Baptiste', '0664966372', 'ISTRES', 0, '$2y$10$Khfk.siL7/6DpQPhU0F7/.Gxph9ADbGy3bu9WYL.2nmKXWboQD/xm', '$2y$10$6sxaezw8YKUSO47LJkmp.O02tPbQTU5Xp2Qf8EVzLxAv1ZwD.1iCS', '2023-07-09 19:57:01', 1, -1),
(31, '2612', 'REIN', 'Julie', 'julierein01@gmail.com', 'ISB ', 0, '$2y$10$4.mKrGOY9A.dFTFUga0WC.eOJxsEXe.dKNzZATktqGEBn2gGsHY62', '$2y$10$Wau.Zjlzr/GOjw3nbWoaj.saxZFn5XwZLWYrtHx8NSOzaASv5jKTW', '2023-07-09 13:26:48', 1, -1),
(32, '1510', 'MOYROUD', 'Manon', '0626578574', 'Aix', 0, '$2y$10$ZBCZCWj9TLAQZduxUzWC1.hA7RKzDaDaFocM1A3nMqn54RvFeLYfK', '$2y$10$IbgYBVBVSCweMMHQv3uZVOtMVBcJRBvYYmW4DOGCfdOpmjbLa0ulq', '2023-07-08 22:30:08', 1, -1),
(33, '1995', 'JULIEN ', 'Kévin ', '0612582352', 'CBN', 0, '$2y$10$uPbvNM7MsjnMh6mkNDnhzuZS47J3Ah2Nh/Etn9GIT9BhTPnGNE0W2', '$2y$10$QOBcAzO9T.qrMfbrNLFvr.93S1Dt9/kgIFHFaiyzPhKGzwgKFXAni', '2023-07-09 08:43:35', 1, -1),
(34, '3006', 'SARRAT', 'Tiphaine', '0602371823', 'LCB13', 0, '$2y$10$S8a7fTJuoEYKZbBLRJPTmOYbjl9/.uxdMTv8QshLxY/p1e7UMFfGS', '$2y$10$VgYgCzYlNUKfopyPdtvk5uTAo2H1Aj01XNoMzkMEzlptlHkFnwVAK', '2023-07-08 22:05:50', 1, -1),
(35, '1919', 'MALFROY', 'Valentin', 'valentinomalf@gmail.com', 'Isb', 0, '$2y$10$IUqO/zjfBDKyb7QJDdlMB.QEB0VOJPTzBB6EMV57AVtKcrEJ6e9Vi', '$2y$10$ClLBuvEQFD5IcAu8/VI4mugMf5yQq6dXnJxLABxP6FJfsJLKbQPBS', '2023-07-07 13:13:23', 1, -1),
(36, '5879', 'JOBIN', 'Marc', 'marc.jobin98@gmail.com', 'ISB', 0, '$2y$10$KCtt/5FnJvdEzpVXdxYhNeSJ6O0wq0d3RiMLNRDi2mUTfLyZ4pqL2', '$2y$10$qat7cgCd4Yj6PZsgg9jQ2e/7Ec5kz7gEJSBAIBFMEgKZ9t8PGL.DO', '2023-07-08 22:05:47', 1, -1),
(37, '2580', 'BLEIN', 'Céline', 'ceceblein@gmail.com', '', 0, '$2y$10$MNyC9kBC85Hrni1jEQyIUehu3SzABnGed9kb/F9.SOoluyqI2eI1e', '$2y$10$dxwta8R/KpM7NtpwsMMK3eXdl1ufHVAda.9zk46pj21Xqgs3GgYrq', '2023-07-07 13:37:47', 1, -1),
(38, '1910', 'STRADY ', 'Romain ', '06 99 52 97 35', 'ISB', 0, '$2y$10$Ek0Ou2PlAFL05M.5BibnLO.T3HW3xydd0DikV/M281F0mclpKRbf2', '$2y$10$U91bxDeaytRGfCr4UAXwWe4sN4D.Zrx0r7l4Djprjxol5qb50BtkG', '2023-07-09 10:17:58', 1, -1),
(39, '1202', 'VIDALE', 'Greg', 'g_vidale@yahoo.fr', 'Isb', 0, '$2y$10$3LFOsNFtq/w2QmCbZmGmKelfbsLnTQNz//awFLDgulFarl/JKQpXq', '$2y$10$mCpyAGdYe4G8lQA/Fx2Mkew./zws.bWm5dNeBZvg/.1ynjEQ4GGEy', '2023-07-09 13:43:19', 1, -1),
(40, '2105', 'PLATEL', 'Romain', '0683440553', 'Trets', 0, '$2y$10$8jwLDVmPO7lP9XtJWBoC3e34cJ6ipS1XOjo5EmMHOdjnseGF3YjGW', '$2y$10$NXILnVpdYnymrTiGZVYsP.hEUiQkQKhV5X.LR06p2cO16CR//FVPO', '2023-07-07 14:21:30', 1, -1),
(41, '1519', 'NORMAND', 'Jérémy', '06 46 41 80 03', 'SMUC', 0, '$2y$10$ZJQKwSPvBJ61qzkIMhlaEeZnodTDVI04CyGXd/6NkQ1U64RySJCA6', '$2y$10$oGAzFiIpyaDqxXw/3bjiTe5AXWYelyxmi/DBvWb4LgUTnVXZFgmXi', '2023-07-07 14:26:23', 1, -1),
(42, '1809', 'SOULIE', 'Fabien', '0620200740', '', 0, '$2y$10$k5xmE3ADfRK2qXr5y0KRUeUsB.74Dvrmt5oGSONgSISWYl1bHdoCa', '$2y$10$QtOMkdPYDkLtGbVyTyR49eeQVnCRF6l3pkX5QuzERPpwNfqZaaKy2', '2023-07-10 08:26:51', 1, 5),
(43, '0604', 'VALLAT ', 'Benjamin ', '0682934462', 'Istres', 0, '$2y$10$P2G7oaP2gp1ggHoBKR/p8uSv0NfLKA2vGJH.bnm02LsAW3kP7a2fq', '$2y$10$s.UQiSTDVAQUGKZ4beW7TOw7jHesua46yIHlg/HEIYxUvxrgcfYfm', '2023-07-09 20:47:14', 1, -1),
(44, '1303', 'XUE', 'Qiong-hui', 'Qiong.hui.xue@gmail.com', 'ISB', 0, '$2y$10$RL61BoIx/tMa/pBUM1XEAem0Zs6P6PI9Kte67Bf2D9.2p0OnD24cy', '$2y$10$aOvM/3ZU3LHLF04zcip4LONP42THWnDzej0S/I3rb/2UVfVhiqN5.', '2023-07-09 20:35:15', 1, -1),
(45, '1402', 'GIBILY', 'Regis', 'regis.gibily@laposte.net', 'KO-83', 0, '$2y$10$euZg.ZyNpI1nRCN5JhQYa.KG3wMjsImu5dN98XfAscytmj1PsTLwy', '$2y$10$1QKg6EDy7Eh3nAcrljeqzevUlLVfi8LMGKExlmUJOBnvzhkCah84S', '2023-07-07 16:54:08', 1, -1),
(46, '2806', 'COYER', 'Yann', '0660256026', 'Isb', 0, '$2y$10$3zUKBp2qE9Muw0sPwW59RuLgv1.Ajg7dMoVuDm1jBhKCU3qi6lNVe', '$2y$10$30X9UiGp6RdsR.BtFvlmI.ACHrWywSd0WbyCLSmVSZTRQp5AAr2ia', '2023-07-07 22:02:57', 0, -1),
(47, '0993', 'SNACEL', 'Benjamin', '0631016514', 'SMUC Badminton', 0, '$2y$10$DXkc2ahMFDb2y6F0ASspVuMTZVFG8zCNJoMC.Szt/7PvQK2gtgXKa', '$2y$10$4k.G52rCEnWae6gDhodwOe9fMY8tvvlRSDF103u82bDLtgFzr0aJe', '2023-07-09 20:31:08', 1, -1),
(48, '1511', 'LORBER', 'Angelo', 'angelo@lorber.fr', 'Apt', 0, '$2y$10$2CFan.5NAGL5ke33rhxWdOJfvraGgFKTamw6lDbcUXmTQGOTYoTti', '$2y$10$whvQcgNjrWSJqgp1FTK2o.3fUMYOmvZaI28FyN8y530alFpEbCuOW', '2023-07-08 18:41:53', 1, 5),
(49, '9062', 'FLOCHON', 'Baptiste', 'nozamdie@gmail.com', 'Kimbad Ollioules', 0, '$2y$10$lxuYKgP8aF1JuiQW0SQ28u3hUj/7Cs89h2s/kZ21IlUtugOdBdoWG', '$2y$10$rWpJ2SNIcMtqcfkSlsg3cu1tq0IraVbm9YgzWfJmd5XKklwC40KOe', '2023-07-08 08:42:08', 1, -1),
(50, '2805', 'DELEVALLET', 'Alexandre', '0647533249', 'Bcb83', 0, '$2y$10$snbi40WvpN.bQlqvswJ3suarXeVy3E9gyLUvFbYFpnXaq53qXIOOK', '$2y$10$DszvN1tKY6V36xOv6T01vuI.gvjmquUVs8dYcJTX4g1fwFtg76cQq', '2023-07-08 08:38:39', 1, -1),
(51, '1993', 'MORZIERES', 'Anthony', 'anthony.morzieres@gmail.com', '', 0, '$2y$10$hfUE6O2QOJ9rsD8r.t9nO.rCjNFtqZ/Wfqwcbd82keT.DktT4kg8q', '$2y$10$xYKfrKpt1KfbosruHm9ckOFuQutF0ve4dUaRV9kGMaR7FVn3KARP6', '2023-07-08 08:37:04', 1, -1),
(52, '1707', 'RICHEZ', 'léa', 'lea.richez@gmail.com', 'SGSCB', 0, '$2y$10$9X.5zM8ErXqTrRtrTOYR4.yCvIJt2BAsNwbxrTzv3o5RT9c5XQmT6', '$2y$10$PqAVzNuM13eZLgJeidzKbu6Kf0oXQHREbJJQ87Vz3fj6TeZYXBXVG', '2023-07-09 10:41:07', 1, -1),
(53, '1234', 'ATTINA', 'Aurore', '0630863556', 'SGSCB', 0, '$2y$10$UTRfD9hyViK5MNQ7a/R8seDUvF9VqUQPlohPnBQWXGhlCvPHxohZO', '$2y$10$b/O187HJb0SqlouJxYRNKu03YKNnQYSxCO4X3.Hcpecnthn5p/GJS', '2023-07-09 10:45:50', 1, -1),
(54, '1203', 'CHAPPE', 'Flavien', '0643561858', 'BCER', 0, '$2y$10$ek1vYxb4hiuaXGyCYSOgHeJy.Xig535WzPq2NFJrdvHqj5hnlPE32', '$2y$10$CsoW3E4dvOK73pA0/lgztuwurJlGx1JLcJOvMEFC8ufWtKtZG0sJW', '2023-07-09 21:03:50', 1, -1),
(55, '2803', 'LAFOUCRIERE', 'Guillaume', '0648702597', '', 0, '$2y$10$AFONqA6NHyNuEIvx8gJOYOMRhkfT9VnLSRUn85H.xwO6FfrmdF0O6', '$2y$10$VO8gHg7tmJAeZV65Nn1VQerR4JVg8cc2UBind6bY2iwbbw62/lr1e', '2023-07-09 19:48:03', 1, 5),
(58, '1703', 'DUFOUR', 'Arnaud', '0631698751', 'Isb 13', 0, '$2y$10$jju7EZev.GTvnOLYLV8YRedfNjuZfzEe9YfHUv4hTd9W5NkVqK5au', '$2y$10$Rimm/0mdP/tcCvNwE.j0OeAhK47J5zZIwdp/JuZyPXM3DDnLcKBnS', '2023-07-08 09:26:10', 1, -1),
(59, '2107', 'LOISY', 'Krissie', '0387029165', '', 0, '$2y$10$qL.pUq6ExnZN6BUAwY8Z1.mv/sD6pAFeJYi6q8bWApcRCtbR7kqoS', '$2y$10$Lh1NjHWKJzgEzg5W4tbjbupvaMOIUpUhVyUu.tbBtHYE72/vZw.ZK', '2023-07-08 09:51:00', 1, -1),
(60, '0699', 'KUHN', 'Clara', '0698336426', '', 0, '$2y$10$BXDGmtVORYFaHiTVpeDsDeCGiQaOeMkYA.wzAwJuqCjWgBz1ovB5m', '$2y$10$nGcquKh2F0k5Jj02ZPxm.u9e/ilRVmvc6kSv44jipUlEHOx4XNiqi', '2023-07-09 06:58:32', 1, -1),
(61, '0512', 'DOUISSARD', 'Camille', '0664448519', 'Kimbad Ollioules', 0, '$2y$10$XnddFFt/huYtWzEWatC3XemEPhTH5ufTfKJ6aoQLTgUI3quBaS5lO', '$2y$10$BrQ1LwUP.7NGdwGzoLUode77K5lmsVoJKDmdUs6NEVV01IdnPjso2', '2023-07-08 09:53:25', 0, -1),
(62, '1106', 'MALLEA', 'Sabine', '0681728205', 'Bam84', 0, '$2y$10$ZNKUFSswuHZe7muAuytQXuP0sJDOE5EvkuFjYKiVN0jQgGbfwyRua', '$2y$10$0dcL6.EYXe86Sc/2.Hj6L.q5GX.4UYAqkbHpnapWuisAn.qSOrVdm', '2023-07-09 20:59:23', 1, -1),
(63, '0211', 'ARNAUD', 'Melody', 'melody.arnaud@yahoo.fr ', 'SGSCB', 0, '$2y$10$qqQ5XUgNWwKq52m3Cc3mtegLD9d0UOnmD0Tje8tTwb7zYDdfTAi8i', '$2y$10$4ntD331TSdzKpH2e9ENh7.iQM7ave13wwA7hjG.FbhnGovpEZmu2a', '2023-07-09 20:20:32', 1, -1),
(64, '3101', 'HOYER ', 'Maxime', 'h.maxime@hotmail.fr', 'SMUC ', 0, '$2y$10$caPbumON/jf1rQ8dKawtDef79iONn6iLxVJWUIeb0HpjhBpwYbte2', '$2y$10$1/Y56nWvqjhz.79v8Bpiz.MvKeM46WJSFBnAk.Qw2OYCWfnsO1jMO', '2023-07-09 14:01:36', 1, -1),
(65, '1410', 'VILLEDIEU', 'CEDRIC', '0610280857', 'Istres ', 0, '$2y$10$adyeD9YZMc22dQo0XID7xummBatLM/QsJEqn/FfQVVIBXoIJuQbNS', '$2y$10$4SaG1LMsTELOBLOID4PrPeWwz6h19KHThGdeEp9SrBYDWqJ7w8NYe', '2023-07-09 13:56:54', 1, -1),
(66, '0404', 'LE DREVO', 'Alexandre', 'Alexandreledrevo@free.fr ', 'Isb', 0, '$2y$10$hWxi4FLUmW9GVEW2KQ2al.rFZOvNAt9epNsQAIbXSgV/tVElZ5Ale', '$2y$10$w76D7onz3YlrflqWnThR3O7eBJO7g7S5x7.v2d0kAft.DNPfVeGBy', '2023-07-09 14:43:19', 1, -1),
(67, '1234', 'MARTIN', 'Anais', 'Anais.martin1313@gmail.com', 'Isb ', 0, '$2y$10$In37T7TC2yUHzBFY2bvJleweZSMPQBIjRAScrdK6fqEClmpKVyZJu', '$2y$10$/rRETmQVjqvEMk4AZi/QQ.Ik5wU3SsbyeLHsbM4V6tl58qpKhwU8m', '2023-07-09 17:50:35', 1, -1),
(68, '0208', 'AHUIR', 'Perrine', '0632373251', 'Isb', 0, '$2y$10$YtLOIEJhPr1yfw06vePhVuOphgB.eQihpEd3gAm4vic6Ors3JeKgi', '$2y$10$Cp/0tdQFj4I3DD5JhAi.nuSjUEJy0zDWW.K8ZTdADb06/HHADEu/e', '2023-07-09 17:12:36', 1, -1),
(69, '1111', 'POPOTAME', 'popot', 'amelaye_dhawai@hotmail.fr ', 'Isb', 0, '$2y$10$eMqdAjpoe9UJg4QReSKnouZyMvn24K0EiK3xoX0X.Sfm7A6yNlrPu', '$2y$10$FYA4s38dQQyKtUWj6zIaP.eLkFPx2dqj2/0vfWeaBE5QXY/fG2HyW', '2023-07-09 14:12:17', 1, -1),
(70, '1417', 'LETAY', 'Robin', 'Robin.letay@gmail.com', 'Smuc', 0, '$2y$10$UxN9WQ1MlyiEb0u3g3J7zuGVnPhM5nB52kOVkeQeY3YUlFBp1w2SS', '$2y$10$DD5UhZaKMY.QADowXkGFtuhKBnyJREnYMiagFbI.XHUD5dQM.U8Aa', '2023-07-09 23:44:47', 1, -1),
(71, '3113', 'RABUSSIER', 'Mélanie ', 'rabussier.melanie@gmail.com', 'MBC', 0, '$2y$10$WYD5eFsvWaSSRHmgwxlr0.gmz9Wiz86Cy83zAIR9hOq4UTPqsE3Ny', '$2y$10$jVASgCg9WKppQk8UvQZHMuSd9WYmXfHHNRcFFGhUT2d.zax1UUsSi', '2023-07-09 11:07:12', 1, -1),
(72, '2317', 'HOOKOOMSING', 'Dilan', '0778784986', '', 0, '$2y$10$OAdifGslAJjNnQ50j/cubOpnGiNOKWe8swEtueVdcnyLsWfnloeJG', '$2y$10$itICqjWhuNr/Pxtn8.rIceE8ZEG6.MwcJpBmtcC3U4i95SFWOJEj6', '2023-07-09 12:24:43', 1, -1),
(73, '1325', 'VITRY', 'Alexis', '0698675087', 'P2P13', 0, '$2y$10$SzPR.Xi1Y14/CAdx5Qt7y.dv5YjMewFnKbAhnSEBbvCoC7CX8F30C', '$2y$10$Dj.77CyAaGbnGwE4DeKc.uUeC/EMVk2gs0K6.66b7llqxUuTBY5Da', '2023-07-08 11:10:30', 1, -1),
(74, '0624', 'DI SANTO', 'Yoann', '0624194549', 'P2p-13', 0, '$2y$10$dwvsoodhhZF9WWoepkEE.Osw440JO7.2A6YE0iCOnimI6pVjkfayy', '$2y$10$fNfE1G/VIRFPwLNruILnDO9V2SCNJQFigEpkLRKAS50ECVr1H1EVC', '2023-07-08 11:08:44', 1, -1),
(75, '0619', 'BRANDAZZI', 'Thomas', 'thomas.brandazzi@gmail.com', 'Roquevaire auriol', 0, '$2y$10$WosakfNktd8dODpt.K3YL.iRSnPBuSAmEw5drTExku0j2Em3c/VJu', '$2y$10$sCdSc2eYOD3677nTGTteX.oEVCbv8.9qxTUOl0.MngzS..jQYc2yy', '2023-07-08 11:14:27', 1, -1),
(76, '1236', 'FOURNEAU', 'Olivier', '0608513260', 'Isb of course', 0, '$2y$10$muxj2MVNDutw7UtNEA1Ybu4SfhZTTwaEZS7y36dbh3l2BmDLnqzG.', '$2y$10$4Ap.QiZ0tMXLJuWHOmCxJeJvNDq2d2YfBQhUwhPJpgkAGuk.tEjYK', '2023-07-08 11:14:27', 1, -1),
(77, '0000', 'GORI', 'Nicolas', 'johng117@hotmail.fr', 'Auriol', 0, '$2y$10$FQKSI/6crzGNTVt9qOoQrubPIMLV2NMdYbSYZL/rqoQcwtF8u.WIC', '$2y$10$Pfvd8Ce2oRoPhvjzE4Xf/OppSBSSAwgd0rxAM431WHrjgTZYLU8hq', '2023-07-08 19:50:07', 1, -1),
(78, '3950', 'OGET', 'Aurelien', '0668016368', 'S13b', 0, '$2y$10$rSxKzoGnS0H3gKZ1h5GazuU9gNSnbfjyPJuhGjZ6q1LC11YiIWZaq', '$2y$10$4PH3V6OFI.oKH64sROEW6.CjL8MgobAxZKTJvZ/aoZio7uwyPmV6.', '2023-07-08 11:15:05', 1, -1),
(79, '0490', 'VANNUNEN', 'Floriane', '0632409780', 'Asah', 0, '$2y$10$PF3/uOxIqSUkUBS760ivhOhtQL1D2xPiSrCkqTiUEOMym0hGZG5I6', '$2y$10$Qp/6rJplrlK6zdXgvTUxP.ZXwlYg6Cd1w3LT46JvEda62kuyTaRwW', '2023-07-09 19:59:28', 1, -1),
(80, '0309', 'CARUSO', 'Corentin', 'Caruso.corentin@laposte.net', '', 0, '$2y$10$gOw9LYkB69t3WvF6pc0gKefH7NPnQirlDeBsLlh4gRU4UGRQw32Mu', '$2y$10$dVRP0dpXKIpSP6RJIxjjPu4nFE3ArfQQkEhNUUHNsuvvAx3uBuewu', '2023-07-09 10:05:21', 1, -1),
(81, '1909', 'TESSIER', 'Theo', '0680247321', 'Juvibad', 0, '$2y$10$P8Cd7BvZ8pcpq0zUrNZRHeBL.57lcxeDqaqpDfoi7MnXjs7PNZpXS', '$2y$10$04qHKd51IXJLR1SjsabFru3XI3BvuXJhOCwIbeh4mNf7MDdGPgRby', '2023-07-09 13:42:43', 1, -1),
(82, '1909', 'SWIFFER', 'Theo', 'theo.tessier@hotmail.fe', 'Juvignac', 0, '$2y$10$qAihzj.el.ciGeWXY5C3se3KLvfJ/QkLcXopme0LHctwTwS/1QQ/G', '$2y$10$PooE0E1KRcZsxkFOE4pu0OC7ZNQnVesI8OOvbjZeJcYLll.H/s2Dq', '2023-07-09 13:35:50', 1, -1),
(83, '0987', 'CHERAMY', 'Baptiste', '0679244553', 'Montpellier', 0, '$2y$10$mQhNBs8ki33lTY2fJSJmTeOS4Kz9fqC/Rw1DlViZHLUQDVvw.Z8G2', '$2y$10$kqBdhY7MNGC08QsQtjlOqexHu6ss3pu8HSCs64/vVPw5qyR7Z5f2.', '2023-07-09 13:54:19', 1, -1),
(84, '1105', 'MAURIERES ', 'Mélanie ', '0645511975', 'Bop', 0, '$2y$10$ilyHJG3xMERRZwiYRBTJW.6IC7hAQvP6q0FJt.IZ2wZYNgdnXQQ.G', '$2y$10$e9ZvWrfDf0OoF5X9.fufAuv3kKQvXzBizt/yC2LOPTAJcw05iWlMO', '2023-07-09 13:37:37', 1, -1),
(85, '1606', 'SERVES', 'Clément', '0667716059', 'Badminton Olympique de Pernes', 0, '$2y$10$uHL4z6cS3jdLQE510NCXf.3EnrFBL2lLUPS1tuM63ABjZk7Lzo8XO', '$2y$10$MBh1yIcKQXyy5eLRbMF/u.zawHd4dodkRtZdW6UZZdLPayFYbCRj.', '2023-07-09 13:41:22', 1, -1),
(86, '0806', 'MULTEDO', 'Alexia', 'Alexia.multedo@gmail.com ', 'ABIL34', 0, '$2y$10$rVsclQbmiFfgQfULRl19UevtfIkhVob7Q6gCa8BY23yUbrNJ5QXVy', '$2y$10$6bYqagatl81LtREFqzPXH..F9WzIahKhO0znzzgcwN19fr39.olDi', '2023-07-09 13:05:41', 1, -1),
(87, '0203', 'RAYMOND ', 'Elodie', '0685606636', 'Juvibad', 0, '$2y$10$NJgiRt9L83hhhtcLfQZrHuRpe6Nn2efy.uiHd81YvHa54xE.LsdGa', '$2y$10$L1RKo93w3bXS3pdsgA6CCOuExcYbM4L74vKRchv4ZHlLBT..zLKo.', '2023-07-09 13:33:21', 1, 5),
(88, '2121', 'GEORGEL', 'Pierre', 'erreip.gorguel@gmail.com', 'Aix en Provence ', 0, '$2y$10$SItm8OinoQthRyE1lneJ3OhhWSuS4sSRvpYLXTpNHITizzxQVQA4i', '$2y$10$lbBESg6O0G/wfBgWuJCQY.kPymHzN7fe1bRSrDC8HuRdxjehoL0TO', '2023-07-09 13:20:14', 1, -1),
(89, '2705', 'BRENO', 'Anne', 'anne.breno34.7@gmail.com', 'Sete ', 0, '$2y$10$75t1PjDiLCxmLPkYHRE43ucvdM9d8SviQjoM8ecm634EVbn4LBhaq', '$2y$10$NOe4rvFsEBMBRsXGkwhqueFOhvHWmr.8t6mWenOOJsifWRuahabhq', '2023-07-10 10:19:15', 1, -1),
(90, '2602', 'CHASTAGNER', 'Cecile', '0629813638', '', 0, '$2y$10$5N5NvA8knRK0T0FXIEkkmeAenKs56pVcF3ZE9ORotd16/3/A9DPbC', '$2y$10$iEdto9hcCHv5MlfftWxpsemgxAWcss69JkZgkAfErupSmOUK8AsLu', '2023-07-09 13:54:00', 1, -1),
(91, '1984', 'LARTILLIER', 'Alexandre', '0670723371', 'Asah', 0, '$2y$10$qp6im8.iipgCvp/uo2ljVOi4/NHNwOKpvfyYgy2Gy8GQ1MUa7KP8u', '$2y$10$rhjHVVO70CKhRp89I.oHnueF.Rl1U/4P8Wf3bZv1cRK7BAMemUhIi', '2023-07-09 14:08:58', 1, -1),
(92, '1234', 'JOURDON', 'Thomas', '0626370281', 'Asah', 0, '$2y$10$EInoG47DF/w9Ja8K8HacIOpPdCgAoKlId9IzVWh7vUSNGdMvK12W.', '$2y$10$SrpJFJ81IdRGkrfDyDHaTeG5yvqIx926ljJkvXApOPFlMFzL7SquO', '2023-07-09 14:13:48', 1, -1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cpi_better`
--
ALTER TABLE `cpi_better`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cpi_better`
--
ALTER TABLE `cpi_better`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

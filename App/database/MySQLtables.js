// use MySQL query to get following table DDL
// SHOW CREATE TABLE `LivestockFeederContract`
// use right click to open DDL file in editor
CREATE TABLE `LivestockFeederContract` (
    `RowId` int(11) NOT NULL,
    `LivestockTag` varchar(20) DEFAULT NULL,
    `FeedLotId` int(11) DEFAULT NULL,
    `LivestockWeight` decimal(10,2) DEFAULT NULL,
    `Latitude` decimal(18,15) DEFAULT NULL,
    `Longitude` decimal(18,15) DEFAULT NULL,
    `Altitude` decimal(18,15) DEFAULT NULL,
    `TransactionTimestamp` text,
    `Household` int(11) DEFAULT NULL,
    `ProjectCode` varchar(10) DEFAULT NULL,
    `Remarks` varchar(45) DEFAULT NULL,
    `VillageName` varchar(100) DEFAULT NULL,
    `LivestockFeederContractDate` varchar(45) DEFAULT NULL,
    `LivestockFeederContractExpDate` varchar(45) DEFAULT NULL,
    `LivestockFeederContractDuration` varchar(45) DEFAULT NULL,
    `LivestockFeederContractName` varchar(45) DEFAULT NULL,
    `NumberOfLivestockRecieved` int(11) DEFAULT NULL,
    `LivestockRecievedTimeStamp` text,
    `LivesstockRecievedLatitude` decimal(18,15) DEFAULT NULL,
    `LivesstockRecievedLongitute` decimal(18,15) DEFAULT NULL,
    `LivesstockRecievedAltitude` decimal(18,15) DEFAULT NULL,
    PRIMARY KEY (`RowId`)
  ) ENGINE=InnoDB DEFAULT CHARSET=latin1

  CREATE TABLE `feedlots` (
    `RowId` int(11) NOT NULL AUTO_INCREMENT,
    `FeedlotId` int(11) DEFAULT NULL,
    `FeedlotName` varchar(100) DEFAULT NULL,
    `FeedlotOwnerId` int(11) DEFAULT NULL,
    `feedlotHouseholdNumber` int(11) DEFAULT NULL,
    `FeedlotAddress` varchar(150) DEFAULT NULL,
    `FeedlotVillage` varchar(45) DEFAULT NULL,
    `FeedlotLatitude` decimal(18,15) DEFAULT NULL,
    `feedlotLongitude` decimal(18,15) DEFAULT NULL,
    `feedlotAltitude` decimal(18,15) DEFAULT NULL,
    `feedlotOwner Name` varchar(150) DEFAULT NULL,
    `feedlotOwnerNIC` varchar(45) DEFAULT NULL,
    `feedlotBankAccountNumber` varchar(45) DEFAULT NULL,
    `feedlotsBankName` varchar(100) DEFAULT NULL,
    `feedlotBankAddress` varchar(100) DEFAULT NULL,
    `feedlotOwnerPhone` varchar(45) DEFAULT NULL,
    `feedlotRegistrationTimestamp` TEXT DEFAULT NULL,
    PRIMARY KEY (`RowId`)
  ) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=latin1
  FeedlotId: NULL,
  : NULL,
  FeedlotOwnerId: NULL,
  : NULL,
  FeedlotVillage: NULL,
  FeedlotLatitude: NULL,
  feedlotLongitude: NULL,
  feedlotAltitude: NULL,
  : NULL,
  : NULL,
  : NULL,
  : NULL,
  : NULL,
  : NULL,
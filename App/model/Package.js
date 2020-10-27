
module.exports = class Package{
    constructor(params){
        // this.rowNumber = params.rowNumber;
        this.packageNumber = params.packageNumber;
        this.projectCode = params.projectCode;
        this.slaughterLivestockTag = params.slaughterLivestockTag;
        this.GPSCoordinates = params.GPSCoordinates;
        this.slaughterDate = params.slaughterDate;
        this.QRCodeGenrateTimestamp = params.QRCodeGenrateTimestamp;
        this.packageRefrigerationTimestamp = params.packageRefrigerationTimestamp;
        this.packageConsumedTimestamp = params.packageConsumedTimestamp;
        this.donorId = params.donorId;
        this.packageConsumtionStatus = params.packageConsumtionStatus;
        this.latitude = params.latitude;
        this.longitude = params.longitude;
        this.altitude = params.altitude;
        this.slaughterLat = params.slaughterLat;
        this.slaughterLng = params.slaughterLng;
        this.slaughterAld = params.slaughterAld;
        this.villageName = params.villageName || params['Village-Name'];
        this.houseHold = params.houseHold;
        this.tagConsumptionTime = params.tagConsumptionTime
    }
}
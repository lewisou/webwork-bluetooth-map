var Latitude = function(value) {
    this.suf = value >= 0 ? 'N' : 'S';
    value = Math.abs(value);
    var deg = Math.floor(value);
    var min = ((value - deg) * 60).toFixed(2);
    this.rmc_text = $.strPad(deg, 2) + '' + min + '' + ',' + this.suf
};

var Longtitude = function(value) {
    this.suf = value >= 0 ? 'E' : 'W';
    value = Math.abs(value);
    var deg = Math.floor(value);
    var min = ((value - deg) * 60).toFixed(2);
    this.rmc_text = $.strPad(deg, 3) + '' + min + '' + ',' + this.suf
};

var GPRMC = function(lat, longt) {
    this.latitude = lat;
    this.longtitude = longt;
};

GPRMC.prototype = {
    latitude : 0,
    longtitude : 0,

    mock_text : function() {
        var now = new Date();
        var vals = [
            '$GPRMC',
            $.strPad(now.getHours(), 2) + $.strPad(now.getMinutes(), 2) + $.strPad(now.getSeconds(), 2),
            'A',
            new Latitude(this.latitude).rmc_text,
            new Longtitude(this.longtitude).rmc_text,
            '1',
            '1',
            $.strPad(now.getDate(), 2) + $.strPad(now.getMonth(), 2) + now.getFullYear().toString().substring(2),
            '1',
            new Longtitude(this.longtitude).suf,
            'A'
        ];
        return vals.join(',') + "\n\r";
    }
};

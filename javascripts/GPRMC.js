var Latitude = function(value) {
    this.suf = value >= 0 ? 'N' : 'S';
    value = Math.abs(value);
    var deg = Math.floor(value);
    var min = ((value - deg) * 60).toFixed(2);
    var min_4 = ((value - deg) * 60).toFixed(4);
    this.rmc_text = $.strPad(deg, 2) + '' + min + '' + ',' + this.suf
    this.gga_text = $.strPad(deg, 2) + '' + min_4 + '' + ',' + this.suf
};

var Longtitude = function(value) {
    this.suf = value >= 0 ? 'E' : 'W';
    value = Math.abs(value);
    var deg = Math.floor(value);
    var min = ((value - deg) * 60).toFixed(2);
    var min_4 = ((value - deg) * 60).toFixed(4);
    this.rmc_text = $.strPad(deg, 3) + '' + min + '' + ',' + this.suf
    this.gga_text = $.strPad(deg, 3) + '' + min_4 + '' + ',' + this.suf
};

var GPRMC = function(lat, longt) {
    this.latitude = lat;
    this.longtitude = longt;
};

GPRMC.prototype = {
    latitude : 0,
    longtitude : 0,

    mock_gga_text : function() {
        // $GPGGA,170834,4124.8963, N,08151.6838, W,1,05,1.5,280.2, M,-34.0, M,,*75
        var now = new Date();
        var vals = [
          'GPGGA',
          $.strPad(now.getHours(), 2) + $.strPad(now.getMinutes(), 2) + $.strPad(now.getSeconds(), 2),
          new Latitude(this.latitude).gga_text,
          new Longtitude(this.longtitude).gga_text,
          '1',
          '05',
          '1.5',
          '280.2',
          'M',
          '-34.0',
          'M',
          '',
          ''
        ];
        return this.full_nmea(vals);
    },

    mock_text : function() {
        var now = new Date();
        var vals = [
            'GPRMC',
            $.strPad(now.getHours(), 2) + $.strPad(now.getMinutes(), 2) + $.strPad(now.getSeconds(), 2),
            'A',
            new Latitude(this.latitude).rmc_text,
            new Longtitude(this.longtitude).rmc_text,
            '000.5',
            '054.7',
            $.strPad(now.getDate(), 2) + $.strPad(now.getMonth(), 2) + now.getFullYear().toString().substring(2),
            '020.3',
            new Longtitude(this.longtitude).suf
        ];
        
        return this.full_nmea(vals);
    },

    full_nmea : function(vals) {
        var content = vals.join(',')
        return '$' + content + '*' + this.check_sum(content);
    },

    check_sum : function(content) {
        var checksum = 0; 
        for(var i = 0; i < content.length; i++) { 
          checksum = checksum ^ content.charCodeAt(i); 
        }
        return $.strPad(checksum.toString(16), 2);
    }
};

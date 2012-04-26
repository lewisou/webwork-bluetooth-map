var KML = function(bt_map) {
    this.logs = $(bt_map.logs).map(function(ind, log) {if(log.has_gps) return log});
};

KML.prototype = {
    logs : [],

    kml_stream : function() {
        var real_this = this;
        var header = ['<?xml version="1.0" encoding="UTF-8"?>',
        '<kml xmlns="http://www.opengis.net/kml/2.2">',
            '<Document>'].join("\r\n");

        var points = this.logs.map(function(ind, ele){
            return real_this.render_single_placemark(ele);
        }).get().join("\r\n");

        var footer = ['</Document>', '</kml>'].join("\r\n");

        return header + points + footer;
    },

    render_single_placemark : function(log) {
        return ['<Placemark>', 
                    '<name>' + log.log_type + ' #' + log.log_index + '</name>',
                    '<description>blank</description>',
                    '<Point>',
                    '<coordinates>' + log.gps.longt + ',' + log.gps.lat + ',0</coordinates>',
                    '</Point>',
                    '</Placemark>'
                ].join("\r\n");
    }
}

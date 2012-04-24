var GoogleImageApi = function(logs, height, width) {
    this.points = $(logs).map(function(ind, ele) {if(ele.has_gps) return ele.gps});
    this.page_h = height;
    this.page_w = width;
};

GoogleImageApi.prototype = {
    points : [],

    req_root : 'http://maps.googleapis.com/maps/api/staticmap?',

    all_points_param : function() {
        return this.points.map(function(ind, ele) {return ele.lat + ',' + ele.longt}).get().join('|');
    },

    request_uri : function() {
        return this.req_root + $.param({
            size : this.page_w + 'x' + this.page_h,
            sensor : false,
            maptype : 'hybrid',
            // roadmap, satellite, terrain, hybrid
            // markers : 'color:blue|label:S %7C 11211 %7C 11206 %7C 11222
            markers : 'color:yellow|label:L|' + this.all_points_param(),
            // zoom : 10
            vf: new Date().getTime()
        });
        // markers=40.714728,-73.998672&zoom=10&size=400x400&maptype=hybrid&sensor=false
    }
};
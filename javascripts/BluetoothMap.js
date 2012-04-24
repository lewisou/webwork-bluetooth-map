var BluetoothMap = function() {};

BluetoothMap.prototype = {
    waiting_gps : false,
    logs : [],
    latest_gps: {
        expired: true,
        values: {}
    },

    switch_page : function(page) {
        $.mobile.changePage(page + '.html', { transition: 'flip'});
    },

    waiting_gps_render : function() {},
    
    start_map : function(map_name) {
        this.init_menus();

        var gps = vxmt.gps.basic;
        gps.start_listen(map_name + '.gps_mess_arrived');

        var bluetooth = vxmt.bluetooth.basic;
        bluetooth.connect('vLocPro', map_name + '.bluetooth_mess_arrived');
    },

    init_menus : function() {
        var real_this = this;
        var mh = blackberry.ui.menu;

        if (mh.getMenuItems().length > 0) {
            mh.clearMenuItems();
        }
        var item = new mh.MenuItem(false, 1, "Show on Map", function() {
            real_this.switch_page('google_map');
        });
        mh.addMenuItem(item);
    },

    pop_menu : function() {
        blackberry.ui.menu.open();
    },

    bluetooth_mess_arrived : function(mess) {
        var p_this = this;
        var log = new BluetoothData(mess);

        this.latest_gps.expired = true;
        this.waiting_gps = true;

        $.mobile.changePage('gps_fixing.html', { transition: 'fade', role : 'dialog'});

        var loop = setInterval(function() {
            p_this.waiting_gps_render();

            if(!p_this.waiting_gps || !p_this.latest_gps.expired) {
                if(!p_this.latest_gps.expired) {
                    log.set_gps(p_this.latest_gps.values);
                }
                clearInterval(loop);
                console.log('out loop');
                $.mobile.changePage('index.html', { transition: 'fade'} );

                p_this.logs.unshift(log);
                p_this.refresh_ui_list(log);
            }
        }, 1000);
    },

    gps_mess_arrived : function(lat, longt) {
        console.log(lat + ', ' + longt);
        this.latest_gps = {
            expired: false,
            values: {'lat' : lat, 'longt' : longt}
        };
    }
};

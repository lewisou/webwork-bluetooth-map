var BluetoothMap = function(map_name) {
    this.map_name = map_name;
    this.file_path = "file:///store/home/user/";

    // this.external_gps_bt_key = map_name + '_gps_' + new Date().getTime();
};

BluetoothMap.prototype = {
    locator_bt_key : null,
    logs : [],
    latest_gps: {
        expired: true,
        values: {}
    },

    started : false,
    start_map : function() {
        var real_this = this;
        if(this.started) {
            return;
        } else {
            this.started = true;
            this.init_menus();

            var gps = vxmt.gps.basic;
            gps.start_listen(this.map_name + '.gps_mess_arrived');

            // connect_to_locator('vLocPro');
            // Test GPS ===================
            // var bluetooth = vxmt.bluetooth.basic;
            // bluetooth.connect(this.external_gps_bt_key, 'HOLUX_M-1200', this.map_name + '.show_gps_mess');
            // setInterval(function(){
                // real_this.write_test_gps_mess(new GPRMC(23.222321, 123.323212).mock_text());
                // real_this.write_test_gps_mess('$GPRMC,225446,A,4916.45,N,12311.12,W,000.5,054.7,191194,020.3,E*68');
            // }, 1000);
        }
    },

    connect_to_locator : function(bt_name) {
        var bluetooth = vxmt.bluetooth.basic;
        if(this.locator_bt_key) {
            bluetooth.close(locator_bt_key);
        }
        this.locator_bt_key = this.map_name + '_locator_' + new Date().getTime();

        bluetooth.connect(this.locator_bt_key, bt_name, this.map_name + '.bluetooth_mess_arrived');
    },

    show_gps_mess : function(mess) {
        alert(mess);
    },

    init_menus : function() {
        var real_this = this;
        var mh = blackberry.ui.menu;

        if (mh.getMenuItems().length > 0) {
            mh.clearMenuItems();
        }

        mh.addMenuItem(
            new mh.MenuItem(false, 1, "Show on Map", function() {
                real_this.switch_page('google_map');
            })
        );

        mh.addMenuItem(
            new mh.MenuItem(false, 2, "Save to KML", function() {
                real_this.switch_page('kml_saving');
            })
        );

        mh.addMenuItem(
            new mh.MenuItem(false, 3, "Open KML", function() {
                real_this.switch_page('open_kml');
            })
        );

        mh.addMenuItem(
            new mh.MenuItem(false, 4, "Setting", function() {
                real_this.switch_page('setting');
            })
        );
    },

    waiting_gps : false,
    bluetooth_mess_arrived : function(mess) {
        var p_this = this;
        var log = new LocatorData(mess);

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
                $.mobile.changePage('index.html', { transition: 'fade'} );

                p_this.logs.unshift(log);
                p_this.refresh_ui_list(log);
            }
        }, 1000);
    },

    write_test_gps_mess : function(mess) {
        var bluetooth = vxmt.bluetooth.basic;
        alert(bluetooth.write_back(this.locator_bt_key, mess));
    },

    gps_mess_arrived : function(lat, longt) {
        this.latest_gps = {
            expired: false,
            values: {'lat' : lat, 'longt' : longt}
        };
        var write_back = new GPRMC(lat, longt).mock_text();
        var bluetooth = vxmt.bluetooth.basic;
        alert(bluetooth.write_back(this.locator_bt_key, write_back));
    },

    switch_page : function(page) {
        var param = arguments.length > 1 ? arguments[1] : {transition: 'flip'}
        $.mobile.changePage(page + '.html', param);
    },

    pop_menu : function() {
        blackberry.ui.menu.open();
    },

    refresh_ui_list : function() {},

    waiting_gps_render : function() {}

};

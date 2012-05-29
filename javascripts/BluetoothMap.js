var BluetoothMap = function(map_name) {
    this.map_name = map_name;
    this.file_path = "file:///SDCard/";

    // this.external_gps_bt_key = map_name + '_gps_' + new Date().getTime();
};

BluetoothMap.prototype = {
    file_name: '',
    saved_file: false,
    locator_bt_key : null,
    logs : [],
    latest_gps: {
        expired: true,
        values: {}
    },

    init_menus : function() {
        var real_this = this;
        var mh = blackberry.ui.menu;

        if (mh.getMenuItems().length > 0) {
            mh.clearMenuItems();
        }

        // mh.addMenuItem(
        //     new mh.MenuItem(false, 1, "Map View", function() {
        //         real_this.switch_page('google_map');
        //     })
        // );

        // mh.addMenuItem(
        //     new mh.MenuItem(false, 2, "Open", function() {
        //         real_this.switch_page('open_kml');
        //     })
        // );

        mh.addMenuItem(
            new mh.MenuItem(false, 1, "Save", function() {
                if(real_this.saved_file) {
                    real_this.save_file();
                } else {
                    real_this.switch_page('save_kml');
                }
            })
        );

        // mh.addMenuItem(
        //     new mh.MenuItem(false, 4, "Setting", function() {
        //         real_this.switch_page('setting');
        //     })
        // );

        // mh.addMenuItem(
        //     new mh.MenuItem(false, 5, "Start Record", function() {
        //         real_this.start_map();
        //     })
        // );
    },


    started : false,
    start_map : function() {
        var real_this = this;
        if(this.started) {
            return;
        } else {
            this.started = true;

            // var bluetooth = vxmt.bluetooth.basic;
            // real_this.connect_to_locator('vLocPro');
            // Test GPS ===================
            // var bluetooth = vxmt.bluetooth.basic;
            // bluetooth.connect(this.external_gps_bt_key, 'vLocPro', this.map_name + '.show_gps_mess');
            var gps = vxmt.gps.basic;
            gps.start_listen(this.map_name + '.gps_mess_arrived');

            var locator_saved_addr = this.get_locator_addr() || '';
            real_this.connect_to_locator(locator_saved_addr);

            // setInterval(function(){
            //     var rmc = new GPRMC(23.232321, 213.232323);
            //     
            //     real_this.write_test_gps_mess(rmc.mock_text());
            //     real_this.write_test_gps_mess(rmc.mock_gga_text());
            // 
            //     // real_this.write_test_gps_mess('$GPRMC,155547,A,2313.94,N,21313.94,E,000.5,054.7,180412,020.3,E*7c');
            //     // real_this.write_test_gps_mess('$GPRMC,225446,A,4916.45,N,12311.12,W,000.5,054.7,191194,020.3,E*68');
            //     // real_this.write_test_gps_mess('$GPGGA,155617,2313.9393,N,21313.9394,E,1,05,1.5,280.2,M,-34.0,M,,*66');
            //     // real_this.write_test_gps_mess('$GPGGA,170834,4124.8963,N,08151.6838,W,1,05,1.5,280.2,M,-34.0,M,,*75');
            // }, 2000);
        }
    },

    connect_to_locator : function(bt_addr) {
        var bluetooth = vxmt.bluetooth.basic;
        if(this.locator_bt_key) {
            bluetooth.close(locator_bt_key);
        }
        this.locator_bt_key = this.map_name + '_locator_' + new Date().getTime();

        bluetooth.connect(this.locator_bt_key, bt_addr, this.map_name + '.bluetooth_mess_arrived');
    },

    waiting_gps : false,
    bluetooth_mess_arrived : function(mess) {
        var p_this = this;
        var log = new LocatorData(mess);
        log.set_gps(p_this.latest_gps.values);
        p_this.logs.unshift(log);
        // alert(this.latest_gps.values.lat || 0);
        // alert(this.latest_gps.values.longt || 0);

        var newPointLocation = new google.maps.LatLng(this.latest_gps.values.lat || 0, this.latest_gps.values.longt || 0);
        var newPoint = new google.maps.Marker({
            position: newPointLocation,
            title: mess
        });
        newPoint.setMap(this.map);
        this.map.setCenter(newPointLocation);
        // this.latest_gps.expired = true;
        // this.waiting_gps = true;
        

        // $.mobile.changePage('gps_fixing.html', { transition: 'fade', role : 'dialog'});

        // var loop = setInterval(function() {
        //     p_this.waiting_gps_render();
        // 
        //     if(!p_this.waiting_gps || !p_this.latest_gps.expired) {
        //         if(!p_this.latest_gps.expired) {
        //             log.set_gps(p_this.latest_gps.values);
        //         }
        //         clearInterval(loop);
        //         $.mobile.changePage('index.html', { transition: 'fade'} );
        // 
        //         p_this.logs.unshift(log);
        //         p_this.refresh_ui_list(log);
        //     }
        // }, 1000);
    },

    write_test_gps_mess : function(mess) {
        var bluetooth = vxmt.bluetooth.basic;
        bluetooth.write_back(this.locator_bt_key, mess);
    },

    gps_mess_arrived : function(lat, longt) {
        //set latest point
        this.latest_gps = {
            expired: false,
            values: {'lat' : lat, 'longt' : longt}
        };

        //write back to locator
        var bluetooth = vxmt.bluetooth.basic;
        var gps_data = new GPRMC(lat, longt);
        this.write_test_gps_mess(gps_data.mock_text());
        this.write_test_gps_mess(gps_data.mock_gga_text());
    },

    switch_page : function(page) {
        // var param = {}
        // // arguments.length > 1 ? arguments[1] : {transition: 'flip'}
        // $.mobile.changePage(page + '.html', param);
        // // $('#' + page + '-page').trigger( "pageinit" );

        $('div.page').hide();
        $('#' + page).show();
    },

    pop_menu : function() {
        blackberry.ui.menu.open();
    },

    open_file : function(json_file) {
        var real_this = this;

        // real_this.attr('data-json')
        blackberry.io.file.readFile(real_this.file_path + json_file, function(_fullPath, contentBlob) {
            real_this.logs = JSON.parse(blackberry.utils.blobToString(contentBlob));
            $(real_this.logs).each(function(ind, ele){
                ele.prototype = LocatorData.prototype;
            });
        }, false);
        
        real_this.saved_file = true;
        real_this.file_name = json_file.substr(0, json_file.length - 5);
    },

    save_file : function() {
        var kml = new KML(app);

        var kmlFilePath = app.file_path + this.file_name + '.kml'
        var jsonFilePath = app.file_path + this.file_name + '.json'

        blackberry.io.file.saveFile(kmlFilePath, blackberry.utils.stringToBlob(kml.kml_stream()));
        blackberry.io.file.saveFile(jsonFilePath, blackberry.utils.stringToBlob(JSON.stringify(app.logs)));
        
        this.saved_file = true;
    },

    init_google_map : function(div_id) {
      var init_center = new google.maps.LatLng(-25.363882,131.044922);

      var myOptions = {
        center: init_center,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: true,
        zoomControl: true
      };
      this.map = new google.maps.Map(document.getElementById(div_id), myOptions);

      // var marker = new google.maps.Marker({
      //     position: myLatlng,
      //     title:"Hello World!"
      // });

      // To add the marker to the map, call setMap();
      // marker.setMap(map);
      // app.init_menus();
    },

    bt_device_list : function() {
      var services = vxmt.bluetooth.basic.service_list();
      return $(services).map(function(_index, ele){
        var vals = ele.split("||");
        return {name : vals[0], addr : vals[1]};
      });
    },

    save_locator_addr : function(addr) {
      localStorage.setItem("locator_addr", addr);
    },

    get_locator_addr : function() {
      return localStorage.getItem('locator_addr');
    }
};

var BluetoothMap = function(){
    this.logs = [];
};
BluetoothMap.prototype.start_map = function(call_back) {
    var menu_handle = blackberry.ui.menu;

    if (menu_handle.getMenuItems().length > 0) {
        menu_handle.clearMenuItems();
    }

    var item = new blackberry.ui.menu.MenuItem(false, 1, "Click Me", customMenuItemClick);
    menu_handle.addMenuItem(item);

    var bluetooth = vxmt.bluetooth.basic;
    // alert(handle.service_list[0]);
    // handle.connect(handle.service_list[0]);
    bluetooth.connect('vLocPro', call_back);
};

BluetoothMap.prototype.pop_menu = function() {
    blackberry.ui.menu.open();
}

BluetoothMap.prototype.bluetooth_mess_arrived = function(mess) {
    var log = new BluetoothData(mess);
    log.fetech_geo();

    this.logs.push(log);
    this.refresh_ui_list(log);
}

BluetoothMap.prototype.get_geo = function(succ_callback, fail_callback, params){
	try {
		if (navigator.geolocation !== null) {
			//Configure optional parameters
			var options;
			if (params) {
				options = eval("options = " + params + ";");
			} else {
				// Uncomment the following line to retrieve the most accurate coordinates available
				// options = { enableHighAccuracy : true, timeout : 60000, maximumAge : 0 };
			}
			navigator.geolocation.getCurrentPosition(succ_callback, fail_callback, options);
		} else {
            // alert("HTML5 geolocation is not supported.");
		}
	} catch (e) {
		alert("exception (getPosition): " + e);
	}
}

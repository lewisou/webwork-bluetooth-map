var app;

//init
function init_pages(){
  //init setting page --------------------------------------------------
  var devices = vxmt ? app.bt_device_list() : [{name : 'locator', addr : '1.23.2'}, {name : 'locator2', addr : '1.23.4'}];
  $(devices).each(function(ind, ele){
      var option = $('<li><input name="locator-addr" type="radio" id="radio-locator-' + ind + '" value="' + ele.addr + '" />\
      <label for="radio-locator-' + ind + '">' + ele.name + '-' + ele.addr + '</label></li>');

      if(ele.addr == app.get_locator_addr()) {
        $('input', option).click();
      }

      $('#setting ul.devices').append(option);
  });
  $('#setting input').live('click', function(){
    app.save_locator_addr($(this).attr('value'));
  });

  //init open kml page --------------------------------------------------
  $('#open_kml .file_list').children().remove();
  var files =  vxmt ? blackberry.io.dir.listFiles(app.file_path) : ['a.kml', 'a.json', 'b.kml', 'b.json'];
  var i = 0;
  for (i = 0; i < files.length; i ++) {
      if(files[i].substr(-3) == 'kml') {
          var json_file = files[i].substr(0, files[i].length - 4) + '.json';
          var new_ele = $('<li><a data-json="' + json_file + '" href="#">' + files[i] +  '</a></li>');
          $('#open_kml .file_list').append(new_ele);
      }
  }
  $('#open_kml .file_list a').live('click', function(evt) {
      var real_this = $(this);
      app.open_file(real_this.attr('data-json'));
      app.start_map();
      app.switch_page('map_canvas');
      evt.preventDefault();
  });
}

$(document).ready(function(){
  app = new BluetoothMap('app');
  init_pages();
  app.init_google_map("map_canvas");

  $('.link_button').bind('click', function(evt){
    if('map_canvas' == $(this).attr('data-page')) {
      if(!app.get_locator_addr()) {
        alert('You must setup the locator first!');
        app.switch_page('setting');
        return;
      }
    }

    app.switch_page($(this).attr('data-page'));
    evt.preventDefault();
  });

  $('.link_button.start_map').live('click', function(){
    app.start_map();
  });

  $('#save_kml .save_button').bind('click', function(evt){
    app.file_name = $('#save_kml .save_file_name').val();
    app.save_file();
    alert('File saved.');
    app.switch_page('map_canvas');
    evt.preventDefault();
  });
  
  app.switch_page('home');
});

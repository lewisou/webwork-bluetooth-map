// LOG, LFFF, #Log_Index, #Frequency, #depth, #Current, #DM_Current, #Direction(0/1)
// 
// LOG, LOC, #Log_Index, #Frequency, #depth, #Current, #Direction(0/1/2)
// 
// Where 0 for forward, 1 for backward, and 2 for undetermined.

var LocatorData = function(raw_data){
    this.log_data = raw_data;
    this.array_data = raw_data.split(",");
    this.array_data = $(this.array_data).map(function(i, ele){
        return i <= 1 ? ele : parseInt(ele);
    });

    this.log_type = this.array_data[1];
    this.log_index = this.array_data[2];
    this.log_frequency = this.array_data[3];
    this.log_depth = this.array_data[4];
    this.log_current = this.array_data[5];
    this.log_dm_current = this.array_data[6];
    this.log_direction = this.array_data[this.array_data.length - 1];

    switch (this.log_direction) {
        case 0: this.log_direction = 'Forward'; break;
        case 1: this.log_direction = 'Backward'; break;
        case 2: this.log_direction = 'Undetermined'; break;
    }
}

LocatorData.prototype = {
    gps: {},
    has_gps: false,

    set_gps : function(data) {
        this.gps = data;
        this.has_gps = true;
    },

    pop_up_mess : function(){
        var vals = ['No#: ' + this.log_index, 'Type: ' + this.log_type, 'Frequency: ' + this.log_frequency, 'Depth: ' + this.log_depth, 
        'Current: ' + this.log_current, 'DM Curr: ' + this.log_dm_current, 'Direction: ' + this.log_direction];
        return vals.join('\n');
    }
}

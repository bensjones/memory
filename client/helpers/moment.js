UI.registerHelper('moment', function(time, format){
    if(format == 'difference') {
        var a = moment();
        var b = moment(time);
        return a.diff(b, 'seconds')
    }
});
$(function() {
    $('#null').click(function() {
        return false;
    });

    //-------Info Live--------//
    chrome.storage.sync.get('infoLive', function(get) { //Vérif si le parametre existe
        if (get['infoLive'] != null) {
            $("#" + get['infoLive']).attr('selected', 'true');
        } else {
            $("#never").attr('selected', 'true');
        }
    });

    $('#infoLive').change(function() { // modif parametre
        chrome.storage.sync.set({
            'infoLive': $('.selInfoLive:selected').attr('value')
        }, function() {});
    });

    //--------Notifictaion---------//
    /*chrome.storage.sync.get('notif', function(get) { //Vérif si le parametre existe
        if (get['notif'] != null) {
            if (get['notif'] == 0) {
                $("#nonN").attr('selected', 'true');
            }
            if (get['notif'] == 1) {
                $("#ouiN").attr('selected', 'true');
            }
        } else {
            $("#ouiN").attr('selected', 'true');
        }
    });

    $('#notif').change(function() { // modif parametre
        chrome.storage.sync.set({
            'notif': $('.selNotif:selected').attr('value')
        }, function() {});
    });*/

    if (localStorage.getItem('notif') == null) {
      $("#ouiN").attr('selected', 'true');
    } else {
      if (localStorage.getItem('notif') == 0) {
        $("#nonN").attr('selected', 'true');
      }
      if (localStorage.getItem('notif') == 1) {
          $("#ouiN").attr('selected', 'true');
      }
    }

    $('#notif').change(function() { // modif parametre
        localStorage.setItem('notif',$('.selNotif:selected').attr('value'));
    });


    //--------Reload Time---------//
    /*chrome.storage.sync.get('reload', function(get) { //Vérif si le parametre existe
        if (get['reload'] != null) {
            $("#" + get['reload']).attr('selected', 'true');
        } else {
            $("#60000").attr('selected', 'true');
        }
    });

    $('#reloadTime').change(function() { // modif parametre
        chrome.storage.sync.set({
            'reload': $('.selReloadTime:selected').attr('value')
        }, function() {});
    });*/

    if (localStorage.getItem('reload') == null) {
      $("#60000").attr('selected', 'true');
    } else {
      $("#" + localStorage.getItem('reload')).attr('selected', 'true');
    }

    $('#reloadTime').change(function() { // modif parametre
        localStorage.setItem('reload',$('.selReloadTime:selected').attr('value'));
    });


    //--------Volume---------//
    chrome.storage.sync.get('volume', function(get) { //Vérif si le parametre existe
        if (get['volume'] != null) {
            var val = get['volume'];
            val *= 100;
            $('#volume').val(val);
            $('#volDisplay').html(Math.round(val) + " %");
        } else {
            $("#volume").val(100);
            $('#volDisplay').html("100 %");
        }
    });

    $('#volume').change(function() { // modif parametre
        var val = $('#volume').val();
        val /= 100;
        chrome.storage.sync.set({
            'volume': val
        }, function() {});
        localStorage.setItem('volume',val);
        $('#volDisplay').html($('#volume').val() + " %");
    });
});

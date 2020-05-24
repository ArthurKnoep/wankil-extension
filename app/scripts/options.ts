import $ from 'jquery';
import { Parameters } from './parameters';

(async () => {
    const parameter = new Parameters();
    $('#null').on('click', () => {
        return false;
    });

    try {
        const infoLive = await parameter.getInfoLive();
        $("#" + infoLive).attr('selected', 'true');
    } catch (e) {
        $("#never").attr('selected', 'true');
    }
    $('#infoLive').on('change', () => {
        parameter.setInfoLive($('.selInfoLive:selected').attr('value') as 'never' | 'live' | 'always');
    });

    try {
        const noel = await parameter.getNoel();
        $(`#noel${noel ? 1 : 0}`).attr('selected', 'true');
    } catch (e) {
        $("#noel1").attr('selected', 'true');
    }
    $('#noelMode').on('change', () => {
        parameter.setNoel($('.selNoelMode:selected').attr('value'));
    });

    if (parameter.getNotification()) {
        $("#ouiN").attr('selected', 'true');
    } else {
        $("#nonN").attr('selected', 'true');
    }
    $('#notif').on('change', () => {
        localStorage.setItem('notif',$('.selNotif:selected').attr('value'));
    });


    $(`#${parameter.getReload()}`).attr('selected', 'true');
    $('#reloadTime').on('change', () => {
        localStorage.setItem('reload',$('.selReloadTime:selected').attr('value'));
    });

    const volumeElem = $('#volume');
    try {
        let volume = await parameter.getVolume();
        volume *= 100;
        volumeElem.val(volume);
        $('#volDisplay').html(Math.round(volume) + " %");
    } catch (e) {
        volumeElem.val(100);
        $('#volDisplay').html("100 %");
    }
    volumeElem.on('change', () => {
        let val = parseInt(volumeElem.val().toString(), 10);
        val /= 100;
        parameter.setVolume(val);
        localStorage.setItem('volume', val.toString());
        $('#volDisplay').html(volumeElem.val() + " %");
    });
})();

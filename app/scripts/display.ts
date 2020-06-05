import $ from 'jquery';
import moment from 'moment';
import { Requester, Stream } from './requester';
import { firstUse as handleFirstUse } from './firstUse';
import { Parameters } from './parameters';
import { userIdToLogin } from './config';
import {
    addGameInfo,
    addLiveTitle,
    addRecIcon, addTimer,
    addTwitchIcon,
    addViewerCounter,
    createStreamerGroup,
    hideLoader,
    setErrorMessage, updateTimer
} from './view';
import { Snow } from './snow';

const findStream = (streams: Stream[], userId: string): Stream => {
    return streams.find(stream => stream.user_id === userId);
}

const prettyPrintLiveDuration = (start: string): string => {
    return moment.utc(moment(new Date()).diff(moment(new Date(start)))).format("HH:mm:ss");
}

const handleUpdateTime = (login: string, startedAt: string) => () => {
    updateTimer(login, prettyPrintLiveDuration(startedAt));
}

const handleDisplay = async (parameters: Parameters, requester: Requester) => {
    let streams: Stream[];
    try {
        streams = await requester.queryStreams(Object.keys(userIdToLogin));
    } catch (e) {
        hideLoader();
        setErrorMessage("Une erreur s'est produite, verifier votre connexion internet");
        return;
    }
    const openMode = await parameters.getInfoLive();

    hideLoader();

    Object.entries(userIdToLogin).forEach(([streamerId, streamer]) => {
        const stream = findStream(streams, streamerId);
        const openButton = $(`#${streamer.login}-btn`);
        const info = $(`#${streamer.login}`);

        addRecIcon(openButton, streamer.login, !!stream, async () => {
            const volume = await parameters.getVolume();
            window.open('https://player.twitch.tv/?volume=' + volume + '&channel=' + streamer.login, streamer.display, 'menubar=no, scrollbars=no, width=870, height=530');
            window.close();
        });
        addTwitchIcon(openButton, streamer.login);
        if (!stream) {
            info.text(`${streamer.display} : Pas en live :'(`);
        } else {
            info.text(`${streamer.display}  en live !!!!`).append($('<br/>'));
            addLiveTitle(info, streamer.login, stream.title);
            addGameInfo(info, streamer.login, stream.game_name);
            addViewerCounter(info, streamer.login, stream.viewer_count);
            addTimer(info, streamer.login, prettyPrintLiveDuration(stream.started_at));
            setInterval(handleUpdateTime(streamer.login, stream.started_at), 1000);
        }

        if (openMode === 'never' || (openMode === 'only' && !stream)) {
            openButton.slideDown(400);
            info.hide();
        }
        if (openMode === 'always' || (openMode === 'only' && !!stream)) {
            openButton.hide();
            info.slideDown(400);
        }
    });
};

(async () => {
    const parameters = new Parameters();
    const requester = new Requester();
    const snow = new Snow();

    const firstUse = await parameters.getFirstUse();
    const noel = await parameters.getNoel();
    if (firstUse) {
        handleFirstUse();
    } else {
        Object.entries(userIdToLogin).forEach(([_, v]) => {
            createStreamerGroup(v.login, v.display);
        });
        if (new Date().getMonth() === 11 && noel) {
            snow.start();
        }
        await handleDisplay(parameters, requester);
    }
})();


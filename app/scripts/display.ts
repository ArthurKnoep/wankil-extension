import $ from 'jquery';
import { TokenManager } from './token';
import { Game, GenericResponse, Requester, Stream } from './requester';
import { firstUse as handleFirstUse } from './firstUse';
import { Parameters } from './parameters';
import { userIdToLogin } from './config';
import {
    addGameInfo,
    addLiveTitle,
    addRecIcon,
    addTwitchIcon,
    addViewerCounter,
    createStreamerGroup,
    hideLoader,
    setErrorMessage
} from './view';

const findStream = (streams: Stream[], userId: string): Stream => {
    return streams.find(stream => stream.user_id === userId);
}

const findGame = (games: Game[], gameId: string): Game => {
    return games.find(game => game.id === gameId);
}

const handleDisplay = async (parameters: Parameters, requester: Requester) => {
    let streams: GenericResponse<Stream[]>;
    let games: GenericResponse<Game[]>;
    try {
        streams = await requester.queryStreams(Object.keys(userIdToLogin));
        const gamesIdNeeded = streams.data.map(stream => stream.game_id);
        if (gamesIdNeeded.length) {
            games = await requester.queryGames(gamesIdNeeded);
        } else {
            games = {
                data: [],
                pagination: {}
            };
        }
    } catch (e) {
        hideLoader();
        setErrorMessage("Une erreur s'est produite, verifier votre connexion internet");
    }
    const openMode = await parameters.getInfoLive();

    hideLoader();

    Object.entries(userIdToLogin).forEach(([streamerId, streamer]) => {
        const stream = findStream(streams.data, streamerId);
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
            const game = findGame(games.data, stream.game_id);
            if (game) {
                addGameInfo(info, streamer.login, game.name);
            }
            addViewerCounter(info, streamer.login, stream.viewer_count);
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
    const tokenManager = new TokenManager();
    const requester = new Requester(tokenManager);

    const firstUse = await parameters.getFirstUse();
    if (firstUse) {
        handleFirstUse();
    } else {
        Object.entries(userIdToLogin).forEach(([_, v]) => {
            createStreamerGroup(v.login, v.display);
        });
        await handleDisplay(parameters, requester);
    }
})();


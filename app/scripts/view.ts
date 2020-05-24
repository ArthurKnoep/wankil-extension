import $ from 'jquery';

export function hideLoader() {
    $('#loader').hide();
}

export function setErrorMessage(errMsg: string) {
    $('#status').append($("<p></p>").text(errMsg).addClass('error-msg'));
}

export function createStreamerGroup(login: string, displayName: string) {
    const openButton = $('<div></div>')
        .attr('id', `${login}-btn`)
        .addClass('open-info').text(displayName)
        .append(
            $('<img/>')
                .attr('src', '/img/fleche.png')
                .addClass('arrow-btn')
        );
    const info = $('<div></div>')
        .attr('id', login)
        .addClass('info');
    $('#status').append(openButton, info);

    openButton.on('click', () => {
        openButton.slideUp(400);
        info.slideDown(400);
    });
    info.on('click', () => {
        openButton.slideDown(400);
        info.slideUp(400);
    });
}

export function addRecIcon(parent: JQuery, login: string, active: boolean, onClick: () => void) {
    parent.append(
        $('<img/>')
            .attr('src', `/img/${active ? 'rec.png' : 'norec.png'}`)
            .attr('id', `${login}-player`)
            .addClass('icon-player')
            .on('click', onClick)
    );
}

export function addTwitchIcon(parent: JQuery, login: string) {
    parent.append(
        $('<a></a>')
            .attr('href', `https://twitch.tv/${login}`)
            .attr('target', '_blank')
            .append(
                $('<img/>')
                    .attr('src', '/img/twitch.png')
                    .addClass('icon-twitch')
            )
    )
}

export function addLiveTitle(parent: JQuery, login: string, title: string) {
    parent
        .append(
            $('<span></span>')
                .text(`Titre: ${title}`)
                .attr('id', `title-${login}`)
                .addClass('infos')
                .append($('<br/>'))
        );
}

export function addGameInfo(parent: JQuery, login: string, gameName: string) {
    parent
        .append(
            $('<span></span>')
                .text(`Jeu: ${gameName}`)
                .attr('id', `game-${login}`)
                .addClass('infos')
                .append($('<br/>'))
        );
}

export function addViewerCounter(parent: JQuery, login: string, viewerCount: number) {
    parent
        .append(
            $('<span></span>')
                .text(`Spectateur: ${viewerCount}`)
                .attr('id', `viewers-${login}`)
                .addClass('infos')
                .append($('<br/>'))
        );
}

export function addTimer(parent: JQuery, login: string, duration: string) {
    parent
        .append(
            $('<span></span>')
                .text(`Live depuis: ${duration}`)
                .attr('id', `time-${login}`)
                .addClass('infos')
                .append($('<br/>'))
        );
}

export function updateTimer(login: string, duration: string) {
    $(`#time-${login}`).text(`Live depuis: ${duration}`);
}

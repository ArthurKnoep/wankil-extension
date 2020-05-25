import { userIdToLogin } from './config';
import { Parameters } from './parameters';
import { TokenManager } from './token';
import { GenericResponse, Requester, Stream } from './requester';

const parameter = new Parameters();
const tokenManager = new TokenManager();
const requester = new Requester(tokenManager);
const notifications = {};
const notificationsMap = {};

const findStream = (streams: Stream[], userId: string): Stream => {
    return streams.find(stream => stream.user_id === userId);
}

const resetNotifications = () => {
    Object.entries(userIdToLogin).forEach(([streamerId]) => {
        notifications[streamerId] = false;
    });
}

const setTitle = (title: string) => {
    chrome.browserAction.getTitle({}, currentTitle => {
        if (currentTitle !== title) {
            chrome.browserAction.setTitle({
                title
            });
        }
    });
};

const setBadgeText = (badgeText: string) => {
    chrome.browserAction.getBadgeText({}, currentBadge => {
        if (badgeText !== currentBadge) {
            chrome.browserAction.setBadgeText({
                text: badgeText,
            });
        }
    });
};

const setIcon = (icon: string) => {
    chrome.browserAction.setIcon({
        path: icon
    });
};

const handleCheckStreams = async () => {
    const notification = parameter.getNotification();
    const reloadTime = parameter.getReload();


    let streams: GenericResponse<Stream[]>
    try {
        streams = await requester.queryStreams(Object.keys(userIdToLogin));
    } catch (e) {
        resetNotifications();
        setTitle("Wankil Studio - Pas internet");
        setBadgeText("");
        setIcon("/img/icon-horsligne.png");
        setTimeout(handleCheckStreams, reloadTime);
        return;
    }

    if (notification) {
        Object.entries(userIdToLogin).forEach(([streamerId, streamer]) => {
            const stream = findStream(streams.data, streamerId);
            if (stream && !notifications[streamerId]) {
                chrome.notifications.create("", {
                    type:    "basic",
                    iconUrl: "/img/icon.png",
                    title:   "Wankil Studio",
                    message: `${streamer.display} ${streamer.plural ? 'sont' : 'est'} en live !!\n${stream.title}`,
                    buttons: [{
                        title: "Ouvrir le player",
                        iconUrl: "/img/twitch.png"
                    }]
                }, notificationId => {
                    notificationsMap[notificationId] = streamer;
                });
                notifications[streamerId] = true;
            } else if (!stream) {
                notifications[streamerId] = false;
            }
        });
    }

    if (streams.data.length === 0) {
        setTitle("Wankil Studio - Pas de live");
        setBadgeText("");
        setIcon("/img/icon.png");
    } else {
        setTitle(`Wankil Studio - ${streams.data.length} live${streams.data.length > 1 ? 's' : ''} en cours !!`);
        setBadgeText(streams.data.length.toString());
        setIcon("img/icon-onlive.png");
    }
    setTimeout(handleCheckStreams, reloadTime);
}

const handleNotificationClick = async (notificationId) => {
    const streamer = notificationsMap[notificationId];
    if (streamer) {
        const volume = await parameter.getVolume();
        window.open(`https://player.twitch.tv/?volume=${volume}&channel=${streamer.login}`, 'Wankil Studio', 'menubar=no, scrollbars=no, width=870, height=530');
    }
}


(() => {
    chrome.notifications.onButtonClicked.addListener(handleNotificationClick);
    resetNotifications();
    handleCheckStreams().catch();
})();

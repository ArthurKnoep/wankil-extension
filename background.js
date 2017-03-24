var chaine = ["wankilstudio", "laink", "terracid"];
var cID = "3i3mp02jq4d7tbbkhfjzhtbpx3iou99";
var sendNotif = [false, false, false];
var search = 0;
var nbLive = 0;
var tour = 0;

//PARAMETRE
var notif;
var timeReload;
var volume;

function getXMLHttpRequest() {
    var xhr = null;

    if (window.XMLHttpRequest || window.ActiveXObject) {
        if (window.ActiveXObject) {
            try {
                xhr = new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
        } else {
            xhr = new XMLHttpRequest();
        }
    } else {
        alert("Votre navigateur ne supporte pas l'objet XMLHTTPRequest...");
        return null;
    }

    return xhr;
}

function request(callback) {
    var xhr = getXMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
            callback(xhr.responseText);
        }
        if (xhr.readyState == 4 && (xhr.status != 200 && xhr.status != 0)) {
            search++;
            if (search == 3) {
                search = 0;
                nbLive = 0;
                setTimeout(function() {
                    request(readData);
                }, 60000);
            } else {
                request(readData);
            }
            chrome.browserAction.setTitle({
                title: "Wankil Studio - Erreur interne"
            });
            chrome.browserAction.setIcon({
                path: "img/icon-horsligne.png"
            });
        }
    };

    xhr.open("GET", "https://api.twitch.tv/kraken/streams/" + chaine[search] + "?client_id=" + cID, true);
    xhr.send(null);
}

function readData(twitchRep) {
    //--------Récuperation des parametre-------//
    //Vérif si le parametre existe
    if (localStorage.getItem('notif') != null) {
        notif = localStorage.getItem('notif');
    } else {
        notif = 1;
    }

    //Vérif si le parametre existe
    if (localStorage.getItem('reload') != null) {
        reload = localStorage.getItem('reload');
    } else {
        reload = 60000;
    }

    //Vérif si le parametre existe
    if (localStorage.getItem('volume') != null) {
        volume = localStorage.getItem('volume');
        if (volume == 0) {
          volume = 0.001;
        }
    } else {
        volume = 1;
    }

    if (twitchRep == "") {
        chrome.browserAction.setTitle({
            title: "Wankil Studio - Pas internet"
        });
        chrome.browserAction.setIcon({
            path: "img/icon-horsligne.png"
        });
        sendNotif[search] = false;
    } else {
        var jsonRep = JSON.parse(twitchRep);

        if (jsonRep["stream"] == null) {
            sendNotif[search] = false;
        } else {
            nbLive++;
            /*chrome.browserAction.setBadgeText({text: "Live"});*/
            if (sendNotif[search] == false && notif == 1) {
                var optionsLainkk = {
                    body: "Laink et Terracid sont en live !!\n" + jsonRep["stream"]["channel"]["status"],
                    icon: "img/icon.png",
                    /*icon: jsonRep["stream"]["preview"]["medium"]*/
                }

                var optionsLaink = {
                    body: 'Laink est en live !!\n' + jsonRep["stream"]["channel"]["status"],
                    icon: "img/icon.png"
                    /*icon: jsonRep["stream"]["preview"]["medium"]*/
                }

                var optionsTerracid = {
                    body: 'Terracid et en live !!\n' + jsonRep["stream"]["channel"]["status"],
                    icon: "img/icon.png"
                    /*icon: jsonRep["stream"]["preview"]["medium"]*/
                }

                if (search == 0) {
                    var lainkkID = null;

                    chrome.notifications.create("", {
                        type:    "basic",
                        iconUrl: "img/icon.png",
                        title:   "Wankil Studio",
                        message: "Laink et Terracid sont en live !!\n" + jsonRep["stream"]["channel"]["status"],
                        contextMessage: "Sur : " + jsonRep["stream"]["game"],
                        buttons: [{
                            title: "Ouvrir le player",
                            iconUrl: "img/twitch.png"
                        }]
                    }, function(id) {
                        lainkkID = id;
                    });
                }
                if (search == 1) {
                    var gl_lainkID = null;

                    chrome.notifications.create("", {
                        type:    "basic",
                        iconUrl: "img/icon.png",
                        title:   "Wankil Studio",
                        message: "Laink est en live !!\n" + jsonRep["stream"]["channel"]["status"],
                        contextMessage: "Sur : " + jsonRep["stream"]["game"],
                        buttons: [{
                            title: "Ouvrir le player",
                            iconUrl: "img/twitch.png"
                        }]
                    }, function(id) {
                        gl_lainkID = id;
                    });
                }
                if (search == 2) {
                    var gl_terracidID = null;

                    chrome.notifications.create("", {
                        type:    "basic",
                        iconUrl: "img/icon.png",
                        title:   "Wankil Studio",
                        message: "Terracid est en live !!\n" + jsonRep["stream"]["channel"]["status"],
                        contextMessage: "Sur : " + jsonRep["stream"]["game"],
                        buttons: [{
                            title: "Ouvrir le player",
                            iconUrl: "img/twitch.png"
                        }]
                    }, function(id) {
                        gl_terracidID = id;
                    });
                }
                chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
                  if (notifId === lainkkID) {
                      if (btnIdx === 0) {
                          window.open('https://player.twitch.tv/?volume='+ volume +'&channel=' + chaine[0], 'Wankil Studio', 'menubar=no, scrollbars=no, width=870, height=530');
                      }
                  }
                  if (notifId === gl_lainkID) {
                      if (btnIdx === 0) {
                          window.open('https://player.twitch.tv/?volume='+ volume +'&channel=' + chaine[1], 'Wankil Studio', 'menubar=no, scrollbars=no, width=870, height=530');
                      }
                  }
                  if (notifId === gl_terracidID) {
                      if (btnIdx === 0) {
                          window.open('https://player.twitch.tv/?volume='+ volume +'&channel=' + chaine[2], 'Wankil Studio', 'menubar=no, scrollbars=no, width=870, height=530');
                      }
                  }
              });

                sendNotif[search] = true;
            }
            else if (notif == 0) {
              sendNotif[search] = false;
            }
        }
        if (nbLive == 0) {
            chrome.browserAction.setTitle({
                title: "Wankil Studio - Pas de live"
            });
            chrome.browserAction.setBadgeText({
                text: ""
            });
            chrome.browserAction.setIcon({
                path: "img/icon.png"
            });
        } else {
            if (nbLive > 1) {
                chrome.browserAction.setTitle({
                    title: "Wankil Studio - " + nbLive + " lives en cours !!"
                });
                chrome.browserAction.setBadgeText({
                    text: nbLive + ""
                });
            } else {
                chrome.browserAction.setTitle({
                    title: "Wankil Studio - " + nbLive + " live en cours !!"
                });
                chrome.browserAction.setBadgeText({
                    text: nbLive + ""
                });
            }
            chrome.browserAction.setIcon({
                path: "img/icon-onlive.png"
            });
        }
    }

    search++;
    if (search == 3) {
        search = 0;
        nbLive = 0;
        setTimeout(function() {
            request(readData);
        }, reload);
    } else {
        request(readData);
    }
}

request(readData); //Démarrage du système

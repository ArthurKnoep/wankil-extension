jQuery(document).ready(function () {
    var chaine = ["wankilstudio", "laink", "terracid"];
    var cID = "3i3mp02jq4d7tbbkhfjzhtbpx3iou99";
    var chaineAffichage = ["Laink et Terracid", "Laink", "Terracid"];
    var dateDeb = Array(3);
    var inLive = [false, false, false];
    var search = 0;

    //--------Récuperation des parametre-------//
    var openInfo = "";
    var volume = "";
    chrome.storage.sync.get('volume', function (get) { //Vérif si le parametre existe
        if (get['volume'] != null) {
            volume = get['volume'];
            if (volume == 0) {
                volume = 0.001;
            }
        } else {
            volume = 1;
        }
    });

    chrome.storage.sync.get('infoLive', function (get) { //Vérif si le parametre existe
        if (get['infoLive'] != null) {
            openInfo = get['infoLive'];
        } else {
            openInfo = "never";
        }
    });


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

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                callback(xhr.responseText);
            }
            if (xhr.readyState == 4 && (xhr.status != 200 && xhr.status != 0)) { //En cas d'erreur on relance la requete dans les 1s
                var loader = document.getElementById('loader'); //cacher l'icone de chargement
                loader.style.display = "none";
                var doc = document.getElementById(chaine[search]);
                doc.innerHTML = "Une erreur interne c'est produite<br>La communication avec Twitch à échoué<br>Code d'erreur : " + xhr.status;
            }
        };

        xhr.open("GET", "https://api.twitch.tv/helix/streams?user_login=" + chaine[search], true);
        xhr.setRequestHeader('Client-ID', cID);
        xhr.send(null);
    }

    function getGameInfo(gameId, cb) {
        var xhr = getXMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && (xhr.status == 200 || xhr.status == 0)) {
                cb(xhr.responseText);
            }
            if (xhr.readyState == 4 && (xhr.status != 200 && xhr.status != 0)) { //En cas d'erreur on relance la requete dans les 1s
                var loader = document.getElementById('loader'); //cacher l'icone de chargement
                loader.style.display = "none";
                var doc = document.getElementById(chaine[search]);
                doc.innerHTML = "Une erreur interne c'est produite<br>La communication avec Twitch à échoué<br>Code d'erreur : " + xhr.status;
            }
        };

        xhr.open("GET", "https://api.twitch.tv/helix/games?id=" + gameId, true);
        xhr.setRequestHeader('Client-ID', cID);
        xhr.send(null);
    }

    function readData(twitchRep) {
        var loader = document.getElementById('loader'); //cacher l'icone de chargement
        loader.style.display = "none";

        var openButton = document.getElementById(chaine[search] + "Button");
        var doc = document.getElementById(chaine[search]);

        setTimeout(function () {
            if (twitchRep == "") {
                doc.innerHTML = "Vérifier votre connexion internet";

                var noNetIcon = document.createElement("img"); //ajout d'une image en cas de live
                noNetIcon.src = "img/nointernet.png";
                noNetIcon.className = "iconNoNet";
                openButton.appendChild(noNetIcon);
            } else {
                var jsonRep = JSON.parse(twitchRep);
                doc.style.whiteSpace = "pre";

                if (jsonRep["data"].length === 0) { //Si le live est hors ligne "data" est vide
                    doc.innerHTML = chaineAffichage[search] + " : Pas en live :'(";
                    var recIcon = document.createElement("img"); //ajout de l'icone "point noir"
                    recIcon.src = "img/norec.png";
                    recIcon.id = "player" + chaine[search];
                    recIcon.className = "iconPlayer";
                    openButton.appendChild(recIcon);

                    var twitchIcon = document.createElement("img"); //ajout du logo twitch
                    twitchIcon.src = "img/twitch.png";
                    twitchIcon.id = "twitch" + chaine[search];
                    twitchIcon.className = "iconTwitch";
                    openButton.appendChild(twitchIcon);
                    inLive[search] = false;
                } else {
                    inLive[search] = true;
                    var recIcon = document.createElement("img"); //ajout de l'icone "point rouge"
                    recIcon.src = "img/rec.png";
                    recIcon.id = "player" + chaine[search];
                    recIcon.className = "iconPlayer";
                    openButton.appendChild(recIcon);

                    var twitchIcon = document.createElement("img"); //ajout du logo twitch
                    twitchIcon.src = "img/twitch.png";
                    twitchIcon.id = "twitch" + chaine[search];
                    twitchIcon.className = "iconTwitch";
                    openButton.appendChild(twitchIcon);

                    doc.innerHTML = chaineAffichage[search] + " en live !!!! <br>"; //ajout d'un titre

                    var title = document.createElement("span"); //ajout du nom du live
                    title.innerHTML = "Titre : " + jsonRep["data"][0]["title"] + "<br>";
                    title.id = "title" + search;
                    title.className = "infos";
                    doc.appendChild(title);

                    getGameInfo(jsonRep["data"][0]["game_id"], function(gameInfo) {
                        if (gameInfo === "") {
                            return;
                        }
                        gameInfoJson = JSON.parse(gameInfo);
                        // ajout du nom du jeu
                        var game = document.createElement("span");
                        game.id = "game" + search;
                        game.className = "infos";
                        game.innerHTML = "Jeu : " + gameInfoJson["data"][0]["name"] + "<br>";
                        doc.appendChild(game);
                    });

                    //ajout du nombre de spectateur
                    var viewers = document.createElement("span");
                    viewers.id = "viewers" + search;
                    viewers.className = "infos";
                    viewers.innerHTML = "Spectateur : " + jsonRep["data"][0]["viewer_count"] + "<br>";
                    doc.appendChild(viewers);

                    var now = new Date(); // récupération de la date actuelle
                    var later = new Date(jsonRep["data"][0]["started_at"])
                    var tempS = Math.floor((now - later) / 1000); //récupération du nombre de seconde du live (date actuelle - date de création du stream), on divise par 1000 car résultat en ms

                    dateDeb[search] = later; //enregistrement de la date de debut dans un tableau

                    long = convertTime(tempS); //convertion du temp en seconde en  A/M/J H:M:S

                    //ajout du temp de live
                    var time = document.createElement("span");
                    time.id = "time" + search;
                    time.className = "infos";
                    time.innerHTML = "Live depuis : " + long + "<br>";
                    doc.appendChild(time);
                }
            }
            if (openInfo == "never") {
                $("#" + chaine[search] + "Button").slideDown(400); //Montrer le bouton pour ouvrir les infos
                $("#" + chaine[search]).hide(); //cacher les infos
            }

            if (openInfo == "only") {
                if (inLive[search] == true) {
                    $("#" + chaine[search] + "Button").hide(); //cacher le bouton pour ouvrir les infos
                    $("#" + chaine[search]).slideDown(400); //montrer les infos
                }
                if (inLive[search] == false) {
                    $("#" + chaine[search] + "Button").slideDown(400); //Montrer le bouton pour ouvrir les infos
                    $("#" + chaine[search]).hide(); //cacher les infos
                }
            }

            if (openInfo == "always") {
                $("#" + chaine[search] + "Button").hide(); //cacher le bouton pour ouvrir les infos
                $("#" + chaine[search]).slideDown(400); //montrer les infos
            }

            search++;
            if (search == 3) {
                //-------Event Listener : Création du player--------//
                $('#player' + chaine[0]).click(function () {
                    window.open('https://player.twitch.tv/?volume=' + volume + '&channel=' + chaine[0], 'Wankil Studio', 'menubar=no, scrollbars=no, width=870, height=530');
                    window.close();
                });
                $('#player' + chaine[1]).click(function () {
                    window.open('https://player.twitch.tv/?volume=' + volume + '&channel=' + chaine[1], 'Wankil Studio', 'menubar=no, scrollbars=no, width=870, height=530');
                    window.close();
                });
                $('#player' + chaine[2]).click(function () {
                    window.open('https://player.twitch.tv/?volume=' + volume + '&channel=' + chaine[2], 'Wankil Studio', 'menubar=no, scrollbars=no, width=870, height=530');
                    window.close();
                });

                //-------Event Listener : Lien vers twitch--------//
                $('#twitch' + chaine[0]).click(function () {
                    var action_url = "http://www.twitch.tv/" + chaine[0];
                    chrome.tabs.create({
                        url: action_url
                    });
                    window.close();
                });
                $('#twitch' + chaine[1]).click(function () {
                    var action_url = "http://www.twitch.tv/" + chaine[1];
                    chrome.tabs.create({
                        url: action_url
                    });
                    window.close();
                });
                $('#twitch' + chaine[2]).click(function () {
                    var action_url = "http://www.twitch.tv/" + chaine[2];
                    chrome.tabs.create({
                        url: action_url
                    });
                    window.close();
                });

                //lancement de la fonction d'actualisation du temps de stream
                reloadTime();
            } else {
                request(readData);
            }
        }, 5);
    }

    //LANCEMENT GENERALE
    chrome.storage.sync.get('firstUse', function (get) { //Vérif si l'extension à deja été lancé
        if (get['firstUse'] == 1 || localStorage['firstUse'] == 1) {
            request(readData); //Démarrage du système
        } else {
            firstUse(); //Demarrage du tuto
        }
    });

    function reloadTime() {
        //Actualisation du temp de stream
        var tempLive;
        var tempActuel = new Date();
        for (i = 0; i < 3; i++) {
            if (inLive[i] == true) {
                tempLive = convertTime(Math.floor((tempActuel - dateDeb[i]) / 1000));
                var time = document.getElementById('time' + i);
                time.innerHTML = "Live depuis : " + tempLive + "<br>";
            }
        }
        setTimeout(function () {
            reloadTime();
        }, 1000);
    }

    function convertTime(timeSecond) {
        //-----Calcul du temps de stream------//
        var seconde = Math.floor(timeSecond % 60);
        var minute = Math.floor((timeSecond / 60) % 60);
        var heure = Math.floor((timeSecond / 3600) % 24);
        var jour = Math.floor((timeSecond / (3600 * 24)) % 30);
        var mois = Math.floor((timeSecond / (3600 * 24 * 30)) % 12);
        var annee = Math.floor((timeSecond / (3600 * 24 * 30 * 12)));

        //------Formatage de la date dans la variable long-------//
        var long = "";
        if (annee != 0) {
            if (annee == 1 || annee == 0) {
                long += annee + " an ";
            } else {
                long += annee + " ans ";
            }
        }
        if (mois != 0 || annee != 0) {
            long += mois + " mois et ";
        }
        if (jour != 0 || mois != 0 || annee != 0) {
            if (jour == 1 || jour == 0) {
                long += jour + " jour ";
            } else {
                long += jour + " jours ";
            }
        }
        if (heure != 0 || jour != 0 || mois != 0 || annee != 0) {
            if (heure == 1 || heure == 0) {
                long += heure + " heure ";
            } else {
                long += heure + " heures ";
            }
        }
        if (minute != 0 || heure != 0 || jour != 0 || mois != 0 || annee != 0) {
            if (minute == 1 || minute == 0) {
                long += minute + " minute ";
            } else {
                long += minute + " minutes ";
            }
        }
        if (seconde == 1 || seconde == 0) {
            long += seconde + " seconde";
        } else {
            long += seconde + " secondes";
        }
        return long;
    }

    //------Coulissement des informations------//

    for (let i = 0; i < 3; i++) {
        $("#" + chaine[i] + "Button").click(function () {
            $("#" + chaine[i] + "Button").slideUp(400);
            $("#" + chaine[i]).slideDown(400);
        });
        $("#" + chaine[i]).click(function () {
            $("#" + chaine[i] + "Button").slideDown(400);
            $("#" + chaine[i]).slideUp(400);
        });
    }
});


//--------premier lancer---------//
function firstUse() {
    var doc = document.getElementById('body');
    doc.style.margin = 0;

    doc.innerHTML = "";

    var img1 = document.createElement('img');
    img1.src = "FirstUse/merci.png";
    img1.id = "img1";
    doc.appendChild(img1);

    $('#img1').click(function () {
        $('#img1').fadeTo(300, 0, function () {
            $('#img1').remove();
            var img2 = document.createElement('img');
            img2.src = "FirstUse/menu1.png";
            img2.id = "img2";
            img2.style.opacity = "0";
            doc.appendChild(img2);
            $("#img2").fadeTo(300, 1);

            img2.addEventListener('click', function () {
                $('#img2').fadeTo(300, 0, function () {
                    $('#img2').remove();
                    var img3 = document.createElement('img');
                    img3.src = "FirstUse/noLive.png";
                    img3.id = "img3";
                    img3.style.opacity = "0";
                    doc.appendChild(img3);
                    $("#img3").fadeTo(300, 1);

                    img3.addEventListener('click', function () {
                        $('#img3').fadeTo(300, 0, function () {
                            $('#img3').remove();
                            var img4 = document.createElement('img');
                            img4.src = "FirstUse/menu2.png";
                            img4.id = "img4";
                            img4.style.opacity = "0";
                            doc.appendChild(img4);
                            $("#img4").fadeTo(300, 1);

                            img4.addEventListener('click', function () {
                                $('#img4').fadeTo(300, 0, function () {
                                    $('#img4').remove();
                                    var img5 = document.createElement('img');
                                    img5.src = "FirstUse/menu3.png";
                                    img5.id = "img5";
                                    img5.style.opacity = "0";
                                    doc.appendChild(img5);
                                    $("#img5").fadeTo(300, 1);

                                    img5.addEventListener('click', function () {
                                        $('#img5').fadeTo(300, 0, function () {
                                            $('#img5').remove();
                                            var img6 = document.createElement('img');
                                            img6.src = "FirstUse/menu4.png";
                                            img6.id = "img6";
                                            img6.style.opacity = "0";
                                            doc.appendChild(img6);
                                            $("#img6").fadeTo(300, 1);

                                            img6.addEventListener('click', function () {
                                                $('#img6').fadeTo(300, 0, function () {
                                                    $('#img6').remove();
                                                    var img7 = document.createElement('img');
                                                    img7.src = "FirstUse/menu5.png";
                                                    img7.id = "img7";
                                                    img7.style.opacity = "0";
                                                    doc.appendChild(img7);
                                                    $("#img7").fadeTo(300, 1);

                                                    img7.addEventListener('click', function () {
                                                        $('#img7').fadeTo(300, 0, function () {
                                                            $('#img7').remove();
                                                            var img8 = document.createElement('img');
                                                            img8.src = "FirstUse/gooduse.png";
                                                            img8.id = "img8";
                                                            img8.style.opacity = "0";
                                                            doc.appendChild(img8);
                                                            $("#img8").fadeTo(300, 1);

                                                            img8.addEventListener('click', function () {
                                                                localStorage['firstUse'] = 1;
                                                                chrome.storage.sync.set({
                                                                    'firstUse': 1
                                                                }, function () { });
                                                                window.close();
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}

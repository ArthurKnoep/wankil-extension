export class Parameters {
    public async getVolume(): Promise<number> {
        return new Promise(resolve => {
            chrome.storage.sync.get('volume', get => {
                let volume;
                if (get['volume'] != null) {
                    volume = get['volume'];
                    if (volume == 0) {
                        volume = 0.001;
                    }
                } else {
                    volume = 1;
                }
                resolve(volume);
            })
        });
    }

    public async getInfoLive(): Promise<"never" | "only" | "always"> {
        return new Promise(resolve => {
            chrome.storage.sync.get('infoLive', function (get) {
                let openInfo;
                if (get['infoLive'] !== undefined) {
                    openInfo = get['infoLive'];
                } else {
                    openInfo = "never";
                }
                resolve(openInfo);
            });
        })
    }

    public async getFirstUse(): Promise<boolean> {
        return new Promise(resolve => {
            chrome.storage.sync.get('firstUse', function (get) {
                if (get['firstUse'] === 1 || window.localStorage.getItem('firstUse') === "no") {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        })
    }

    public async getNoel(): Promise<boolean> {
        return new Promise(resolve => {
            chrome.storage.sync.get('modeNoel', function (get) {
                if (get['modeNoel'] !== undefined) {
                    resolve(get['modeNoel'] === '1');
                } else {
                    resolve(true);
                }
            });
        })
    }

    public getNotification(): boolean {
        if (localStorage.getItem('notif') === null) {
            return true;
        }
        return localStorage.getItem('notif') === '1';
    }

    public getReload(): number {
        if (localStorage.getItem('reload') === null) {
            return 60000;
        }
        return parseInt(localStorage.getItem('reload'), 10);
    }

    public async setFirstUse() {
        return new Promise(resolve => {
            chrome.storage.sync.set({
                'firstUse': 1
            }, () => resolve());
        });
    }

    public async setVolume(volume: number) {
        return new Promise(resolve => {
            chrome.storage.sync.set({
                'volume': volume
            }, () => resolve());
        });
    }

    public setInfoLive(mode: "never" | "live" | "always") {
        return new Promise(resolve => {
            chrome.storage.sync.set({
                'infoLive': mode
            }, () => resolve());
        });
    }

    public setNoel(value: string) {
        return new Promise(resolve => {
            chrome.storage.sync.set({
                'modeNoel': value
            }, () => resolve());
        });
    }
}

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

    public async setFirstUse() {
        return new Promise(resolve => {
            chrome.storage.sync.set({
                'firstUse': 1
            }, () => resolve());
        });
    }
}

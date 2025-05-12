chrome.runtime.onInstalled.addListener(() => {
    chrome.tabs.query({ url: "*://*.tankionline.com/*" }, tabs => {
        tabs.forEach(tab => {
            fetch('https://raw.githubusercontent.com/LEaRCrEaM/Tanki-Online/main/user.js')
                .then(res => res.text())
                .then(script => {
                    console.log(script);
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'injectScript',
                        script: script
                    });
                });
        });
    });
});

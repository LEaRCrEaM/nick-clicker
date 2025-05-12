const removeTargetedScripts = (mutations) => {
    for (let mutation of mutations) {
        // Check if there are added nodes and the first one is a script element
        if (mutation.addedNodes.length > 0) {
            const addedNode = mutation.addedNodes[0];
            if (addedNode instanceof HTMLScriptElement) {
                const scriptElement = addedNode;

                // Check if the script source URL contains "/static/js/"
                if (scriptElement.src.includes("/static/js/")) {
                    console.log(`Removing script: ${scriptElement.src}`);
                    fetch(scriptElement.src);
                    scriptElement.remove(); // Remove the script element
                }
            }
        }
    }
};

// Function to start observing the DOM for added script elements
const startObserving = () => {
    const observer = new MutationObserver(removeTargetedScripts);
    observer.observe(document, {
        attributes: true,
        childList: true,
        subtree: true
    });
};
// Initialize the MutationObserver
startObserving();

// Listen for a message from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'injectScript') {
        const blob = new Blob([message.script], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => URL.revokeObjectURL(url);
        document.documentElement.appendChild(script);
    }
});

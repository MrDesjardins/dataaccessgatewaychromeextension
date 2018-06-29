/*
 * agent -> **content-script.js** -> background.js -> dev tools
 */
window.addEventListener("message", (event) => {
    console.warn("CONTENTSCRIPT RECEIVE MESSAGE", event);
    // Only accept messages from the same frame
    if (event.source !== window) {
        return;
    }

    var message = event.data;

    // Only accept messages that we know are ours
    if (typeof message !== "object" || message === null ||
        !message.source && message.source !== "dataaccessgateway-agent") {
        return;
    }
    console.warn("CONTENTSCRIPT SEND MESSAGE", message);
    chrome.runtime.sendMessage(message);
});



/*
 * agent <- **content-script.js** <- background.js <- dev tools
 */
chrome.runtime.onMessage.addListener((request) => {
    console.warn("CONTENTSCRIPT READ MESSAGE", request);
    request.source = 'dataaccessgateway-devtools';
    window.postMessage(request, '*');
});
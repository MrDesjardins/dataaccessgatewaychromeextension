let tabPorts: { [tabId: string]: chrome.runtime.Port } = {};
// Receive message from content script and relay to the devTools page for the
// current tab
/*
 * agent -> content-script.js -> **background.js** -> dev tools
 */
chrome.runtime.onMessage.addListener((message, sender) => {
    console.log("BACKGROUND received message", message, sender);
    const port = sender.tab && sender.tab.id !== undefined && tabPorts[sender.tab.id];
    if (port) {
        console.log("BACKGROUND postMessage", message, port);
        port.postMessage(message);
    } else {
        console.log("Tab not found in connection list.", message, tabPorts);
    }
    return true;
});

/*
 * agent <- content-script.js <- **background.js** <- dev tools
 */
chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
    console.warn("BACKGROUND ON-CONNECT", port);
    let tabId: any;
    chrome.runtime.onMessage.addListener
    port.onMessage.addListener(message => {
        console.warn("BACKGROUND ON-CONNECT Add tab", port);
        if (message.name == "init") { // set in devtools.ts
            if (!tabId) {
                // this is a first message from devtools so let's set the tabId-port mapping
                tabId = message.tabId;
                tabPorts[tabId] = port;
            }
        }
        if (message.code || message.file) {
            delete message.tabId;
            chrome.tabs.executeScript(tabId, message);
        }
    });
    port.onDisconnect.addListener(() => {
        delete tabPorts[tabId];
    });
});

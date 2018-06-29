var port = chrome.runtime.connect({
    name: "panel"
});
console.warn("DEV TOOL Connect()");
port.postMessage({
    name: "init",
    tabId: chrome.devtools.inspectedWindow.tabId
});
port.onMessage.addListener(message => {
    console.warn("***DEV TOOL***", message);
});

chrome.devtools.panels.create("Data Access Gateway",
    "images/dagdl32.png",
    "panel.html",
    (extensionPanel: chrome.devtools.panels.ExtensionPanel) => {

        const show = new Promise<Window>((resolve) => {
            extensionPanel.onShown.addListener((panelWindow: Window) => {
                resolve(panelWindow);
            });
        });


        show.then((panelWindow: Window) => {
            const div = document.createElement("div");
            div.innerHTML = "TEST CREATE 2";
            panelWindow.document.body.appendChild(div);
        });


    }
);
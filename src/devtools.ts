var port = chrome.runtime.connect({
    name: "panel"
});
let panelWindow: Window | undefined;
port.postMessage({
    name: "init",
    tabId: chrome.devtools.inspectedWindow.tabId
});
port.onMessage.addListener((message: Message) => {
    const div = document.createElement("div");
    div.innerHTML += message.payload.id + ", ";
    div.innerHTML += message.payload.action + ", ";
    div.innerHTML += message.payload.source;
    if (panelWindow !== undefined) {
        panelWindow.document.body.appendChild(div);
    }
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

        show.then((panelWindowIn: Window) => {
            panelWindow = panelWindowIn;
            const div = document.createElement("div");
            div.innerHTML = "TEST CREATE 2";
            panelWindow.document.body.appendChild(div);
        });
    }
);
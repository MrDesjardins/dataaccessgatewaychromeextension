var s = document.createElement("script");
s.src = chrome.extension.getURL("injectscript.js");
s.onload = function () {
    this.remove();
};
console.warn("INJECT SHIM");
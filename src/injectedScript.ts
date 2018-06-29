// (document.head || document.documentElement).appendChild(s);
// (window as any).dataaccessgateway_loginfo = (info: any) =>{
//     console.warn("INJECT CODE->MESSAGE");
//     // https://developer.chrome.com/extensions/messaging#external-webpage
//     chrome.runtime.sendMessage(
//         "ppdelpgokhkgengkiinfndkiopekfgci",
//         info
//     );
//     window.postMessage({
//         payload:info
//       }, '*');
// }

// console.warn("INJECT CODE");

window.postMessage({
    greeting: 'hello there!',
    source: 'my-devtools-extension'
}, '*');
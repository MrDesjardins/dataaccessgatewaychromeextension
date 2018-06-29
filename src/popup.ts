let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function (data) {
    if (changeColor !== null) {
        changeColor.style.backgroundColor = data.color;
        changeColor.setAttribute('value', data.color);
    }
});
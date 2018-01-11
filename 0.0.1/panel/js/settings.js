function openOptionsView() {
    browser.windows.update(
        contentWindowId,
        { focused: true }
    );
    chrome.tabs.create({
        url: chrome.extension.getURL('katalon/options.html'),
        windowId: contentWindowId
    }, function(tab){});
}

document.getElementById("settings").addEventListener("click", function(event) {
    openOptionsView();
});

if (browser.runtime.getBrowserInfo) {
    browser.runtime.getBrowserInfo().then(function(info) {
        if (info.name === 'Firefox') {
            $('#settings').remove();
        }
    });
}
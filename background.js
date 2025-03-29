chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: downloadSubtitles,
  });
});

function downloadSubtitles() {
  window.postMessage({ type: 'DOWNLOAD_SUBTITLES' }, '*');
}

const ChromeApiHelper = {
  reloadCurrentTab() {
    console.log('reload current tab');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    });
  },
};

export default ChromeApiHelper;

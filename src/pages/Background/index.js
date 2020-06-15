import '../../assets/img/icon-34.png';
import BookmarkStore from '../../storages/BookmarkStore';
import { logBookmarks, logPopup } from '../../helpers/Logger';

chrome.browserAction.onClicked.addListener(() => {
  chrome.windows.getCurrent(function (win) {
    console.log('open popup');
    const browserAddressBarHeight = 130;
    var width = 440;
    var height = screen.height - browserAddressBarHeight;
    var left = screen.width;
    var top = browserAddressBarHeight;
    chrome.windows.create({
      url: 'popup.html',
      width: width,
      height: height,
      top: Math.round(top),
      left: Math.round(left),
      type: 'popup',
    });
  });
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.importBookmarks) {
    logBookmarks('event listener: init import bookmarks');
     chrome.bookmarks.getTree(BookmarkStore.importBookmarks);
  }

  if (request.tts) {
    //TODO: send chrome message
    chrome.tts.speak(request.message, {
      lang: 'de-DE',
    });
  }

  return false;
});

chrome.bookmarks.onCreated.addListener(BookmarkStore.removeBookmarks);
chrome.bookmarks.onRemoved.addListener(BookmarkStore.removeBookmarks);
chrome.bookmarks.onChanged.addListener(BookmarkStore.removeBookmarks);

//Only shows the page icon if we are on www.tuenti.com
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url && (tab.url.indexOf('http://www.tuenti.com') === 0||tab.url.indexOf('https://www.tuenti.com') === 0)) {
        chrome.pageAction.show(tabId);
    }
});

//If we receive a download photo request message from tuenti_album.js, download it.
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    
	if (request.link !== undefined) 
	{

		chrome.downloads.download({
  			url: request.link,
  			filename: request.route+request.name+".jpg"
		});
		sendResponse({});
	}
  });
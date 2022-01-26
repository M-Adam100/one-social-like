chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension Installed!");
});


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'OPEN FACEBOOK') {
        chrome.windows.create({
            url: request.url,
            focused: true,
            width: 950,
            height: 775,
            type: 'popup',
        }, ({ tabs: [newTab] }) => {
			setTimeout(() => {
				chrome.scripting.executeScript({
					target: { tabId: newTab.id },
					files: [
						"scripts/fb-like.js"
				],
				
				})
			}, 2000);

        });
    }
})

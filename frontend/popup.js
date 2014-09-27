var options = {
    timePeriod: "current",
    lastLocation: {
        latitude: 0,
        longitude: 0
    },
    personal: "yes"
}


document.addEventListener('new_data', function () {
	console.log("Popup.js called!");

	chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
		console.log("Got a message!");

		data = req.data;
		var data2 = chrome.storage.sync.get("data")
		data2.push(data)
		chrome.storage.sync.set({data: data2}, function() {})

	 	sendResponse({ok: 1});
	});
});

/* Returns a list of urls that you should open*/
function getTabSuggestions() {

}

/* Uses chrome.tabs to open all of the tabs from the suggestions*/
function openTabSuggestions(tabs) {
    
}

/* Changes the suggestion options. */
function setSuggestionOptions(newOptions) {
    for (var attr in newOptions) {
        options[attr] = newOptions[attr]
    }
}



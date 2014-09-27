var IP = "72.2.119.17"
var options = {
    timePeriod: "current",
    lastLocation: {
        latitude: 0,
        longitude: 0
    },
    personal: "yes"
}
var userId = undefined
var lastSuggestions = []

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if (!userId) {
        console.log("Got id: ", req);
    }
    userId = req.userId;
  	sendResponse({ok: 1});
});

/* Returns a list of urls that you should open*/
function getTabSuggestions(cb) {
    if (userId == undefined) {
        return cb([])
    }
    if (options.personal === "yes") {
        console.log("Getting suggestions!")
        $.get("http://" + IP + ":8080/api/suggest", {options: {userId: userId}}, function(data) {
            console.log(data)
            lastSuggestions = data
            cb(data.urls)
        });
    } else {
        cb([])
    }
}


/* Changes the suggestion options. */
function setSuggestionOptions(newOptions) {
    for (var attr in newOptions) {
        options[attr] = newOptions[attr]
    }
}

$(document).ready(function(){
    console.log("Ready")
	getTabSuggestions(function(urls){
        console.log(urls)
		DomChanger.displaySuggestions(urls)
		chrome.storage.sync.set({lastSuggestions: urls}, function(){})
	});

    setInterval(function(){
		getTabSuggestions(function(urls){
            console.log(urls)
			DomChanger.displaySuggestions(urls)
			chrome.storage.sync.set({lastSuggestions: urls}, function(){})
		})
	}, 1000)
})

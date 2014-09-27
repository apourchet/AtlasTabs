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
        if (navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(function (position){
                var lat = position.coords.latitude
                var lon = position.coords.longitude
                $.get("http://" + IP + ":8080/api/suggest", {options: {userId: userId, location:[lon, lat]}}, function(data) {
                    cb(data.urls)
                });
            });
        }
    } else {
        cb([])
    }
}

function cacheSuggestions(urls) {
    console.log("Caching the last suggestions: ", urls)
    chrome.storage.local.set({lastSuggestions: urls}, function(){
        chrome.storage.local.get(null, function(o) {
            // DomChanger.displaySuggestions(o.lastSuggestions)
            console.log("The last suggestions were: ", o.lastSuggestions)
        });
    });
}

/* Changes the suggestion options. */
function setSuggestionOptions(newOptions) {
    for (var attr in newOptions) {
        options[attr] = newOptions[attr]
    }
}

$(document).ready(function(){
    console.log("Ready")
    chrome.storage.local.get(null, function(o) {
        if (!o || !o.lastSuggestions) {
            o = {lastSuggestions: []}
        }
        DomChanger.displaySuggestions(o.lastSuggestions)
        getTabSuggestions(function(urls){
	    	DomChanger.displaySuggestions(urls)
            cacheSuggestions(urls)
	    });

        setInterval(function(){
	    	getTabSuggestions(function(urls){
	    		DomChanger.displaySuggestions(urls)
                cacheSuggestions(urls)
	    	});
	    }, 1000)
    });
})

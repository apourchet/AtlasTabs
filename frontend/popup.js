var IP = "72.2.119.17"
var options = {
    timePeriod: "current",
    lastLocation: {
        latitude: 0,
        longitude: 0
    },
    personal: true
}
var loaded = false
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
    if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function (position){
            var lat = position.coords.latitude
            var lon = position.coords.longitude
            if (options.personal) {
                $.get("http://" + IP + ":8080/api/suggest", {options: {userId: userId, location:[lon, lat]}}, function(data) {
                    cb(data.urls)
                });    
            } else {
                $.get("http://" + IP + ":8080/api/trending", {options: {location:[lon, lat], timeFrame: 20}}, function(data) {
                    cb(data.urls)
                });
            }
        });
    }
}

function reloadSuggestions() {
    getTabSuggestions(function(urls){
		DomChanger.displaySuggestions(urls)
        cacheSuggestions(urls)
	});
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

chrome.storage.local.get(null, function(o) {
    if (loaded && o != undefined) {
        if (!o.lastSuggestions) {
            o.lastSuggestions = []
        }
        DomChanger.displaySuggestions(o.lastSuggestions)
    }
});

function setPrivacy(b) {
    options.personal = b
    reloadSuggestions();
}

$(document).ready(function(){
    console.log("Ready")
    loaded = true
    reloadSuggestions()
    chrome.storage.local.get(null, function(o) {
        if (!o || !o.lastSuggestions) {
            o = {lastSuggestions: []}
        }
        DomChanger.displaySuggestions(o.lastSuggestions)
        reloadSuggestions();

        setInterval(function(){
            if (options.personal) {
	    	    reloadSuggestions();
            }
	    }, 5000);
        setInterval(function(){
            if (!options.personal) {
	    	    reloadSuggestions();
            }
	    }, 500);
    });
    $("#trending-button").click(function(e) {
        setPrivacy(false);
    });
    
    $("#suggestion-button").click(function(e) {
        setPrivacy(true);
    });

});

document.addEventListener('DOMContentLoaded', function () {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        (function () {
            var ln = links[i];
            var location = ln.href;
            ln.onclick = function () {
                DomChanger.openTab(location);
                // chrome.tabs.create({active: true, url: location});
            };
        })();
    }
});
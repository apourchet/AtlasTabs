var IP = "72.2.119.17"
var options = {
    timePeriod: "current",
    lastLocation: {
        latitude: 0,
        longitude: 0
    },
    personal: 1,
    numTabs: 5,
    distPriority: 7,
    timePriority: 5
}

var lastLoaded = [[],[]]
var inSettings = false
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
function getTabSuggestions(a, cb) {
    if (userId == undefined) {
        return cb([])
    }
    if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function (position){
            var lat = position.coords.latitude
            var lon = position.coords.longitude
            if (a) {
                $.get("http://" + IP + ":8080/api/suggest", {options: {userId: userId, location:[lon, lat], radius: options.distPriority}}, function(data) {
                    cb(data.urls)
                });    
            } else {
                $.get("http://" + IP + ":8080/api/trending", {options: {location:[lon, lat], timeFrame: options.timePriority, radius: options.distPriority}}, function(data) {
                    cb(data.urls)
                });
            }
        });
    }
}

function reloadSuggestions(a) {
    a = (a == undefined) ? options.personal : a
    console.log("Reloading suggestions: " + a)
    getTabSuggestions(a, function(urls){
        cacheSuggestions(urls, a)
	});
}

function cacheSuggestions(urls, a) {
    var obj = {}
    obj["lastLoaded" + a] = urls
    chrome.storage.local.set(obj, function(){});
}

/* Changes the suggestion options. */
function setSuggestionOptions(newOptions) {
    for (var attr in newOptions) {
        options[attr] = newOptions[attr]
    }
    cacheSettings()
}

function reloadDisplay() {
    if (!inSettings) {
        console.log("Displaying " + options.personal)
        DomChanger.displaySuggestions(lastLoaded[options.personal], options.numTabs);
        if (options.personal) {
            $("#suggestion-button").focus()
        } else {
            $("#trending-button").focus()
        }
    } else {
        DomChanger.displaySettings(options)
    }
}

chrome.storage.local.get(null, function(o) {
    if (o["lastLoaded0"]) {
        lastLoaded[0] = o["lastLoaded0"]
    }
    if (o["lastLoaded1"]) {
        lastLoaded[1] = o["lastLoaded1"]
    }
    if (o["options"]) {
        options = o["options"]
    }
    reloadDisplay()
});

function cacheSettings() {
    chrome.storage.local.set({options: options}, function(){});
}

function setPrivacy(b) {
    options.personal = b ? 1 : 0
    inSettings = false
    reloadDisplay()
    cacheSettings()
}

function openAll() {
    var links = document.getElementsByTagName("a");
    for (var i = 0; i < links.length; i++) {
        var ln = links[i];
        var location = ln.href;
        chrome.tabs.create({active: true, url: location});
    }
}

function setIntervals() {
    setTimeout(function(){
        reloadDisplay()
    }, 50);
    setInterval(function(){
	    reloadSuggestions(0);
	}, 2000);
    setInterval(function(){
		reloadSuggestions(1);
	}, 2000);
}

$(document).ready(function(){
    console.log("Ready")
    
    setIntervals()
    
    $("#settings").click(function(e){
        DomChanger.displaySettings(options);
        inSettings = true
    });

    $("#trending-button").click(function(e) {
        setPrivacy(false);
    });
    
    $("#suggestion-button").click(function(e) {
        setPrivacy(true);
    });

    $("#openall-button").click(function(e) {
        openAll();
    });
    reloadDisplay()

});


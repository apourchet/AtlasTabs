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
    if (options.personal === "yes"){
    	var data = chrome.storage.sync.get("data")
    	var lat = 0, lon = 0
    	
    	if (navigator.geolocation) {
        	navigator.geolocation.getCurrentPosition(function (position){
        		lat = position.coords.latitude
        		lon = position.coords.longitude
        	})
        }
    	
    	for (elem in data){
    		var la = elem.location.latitude, lo = elem.location.longitude
    		var d1 = lat - la , d2 = lon - lo
    		elem.distance = Math.sqrt(d1*d1 + d2*d2)
    	}

    	data.sort(function (a, b){
    		a.distance - b.distance
    	})
    	
    	var myDataFin = []
    	for (var elem in data){
    		elem.URLs.sort()
    		var num = 1, l = elem.URLs.length, url = elem.URLs[0]
    		var myData = []
    		for (var i = 1 ; i < l ; i++){
    			if (elem.URLs[i] === url)
    				num ++;
    			else {
    				myData.push({url: url, n: Math.log(num), dist: Math.exp(elem.distance)})
    				url = elem.URLs[i]
    				num = 1
    			}
    		}
    		myData.push({url: url, n: Math.log(num), dist: Math.exp(elem.distance)})
    		myDataFin(myData)
    	}
    	
    }
    else {

    }
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



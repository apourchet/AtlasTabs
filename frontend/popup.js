var options = {
    timePeriod: "current",
    lastLocation: {
        latitude: 0,
        longitude: 0
    },
    personal: "yes"
}
//var loaded = false
var lastSuggestions = []

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
	var data = req;
	chrome.storage.sync.get(null, function(o) {
		if (!o.data) {
			chrome.storage.sync.set({data: []}, function(){})
			return
		}
		var data2 = o.data
		//console.log("Got data: ", data2)
		data2.push(data)
		chrome.storage.sync.set({data: data2}, function() {})

	 	sendResponse({ok: 1});
	});
});

/* Returns a list of urls that you should open*/
function getTabSuggestions(cb) {
    if (options.personal === "yes"){
    	chrome.storage.sync.get("data", function(o){
	    	var lat = 0
	    	var lon = 0
	    	var time = (new Date()).getTime()
	    	var data = o.data
	    	if (data.length == 0) {
	    		return cb([])
	    	}
	    	
	    	if (navigator.geolocation) {
	    		var start = new Date().getTime()
	        	navigator.geolocation.getCurrentPosition(function (position){
	        		lat = position.coords.latitude
	        		lon = position.coords.longitude
	        		// console.log("Position: " + lat + " ; " + lon)
					for (elem in data){
			    		var d1 = lat - data[elem].location.latitude 
			    		var d2 = lon - data[elem].location.longitude
			    		var d3 = Math.abs(data[elem].time - time)
			    		data[elem].distance = Math.sqrt(d1*d1 + d2*d2)
			    		data[elem].timeDiffrence = d3
			    	}

			    	data.sort(function (a, b){
			    		return a.distance - b.distance
			    	})
			    	
			    	var myData = []
			    	for (var elem in data){
			    		data[elem].URLs.sort()
			    		var num = 1
			    		var l = data[elem].URLs.length
			    		var url = data[elem].URLs[0]
			    		for (var i = 1 ; i < l ; i++){
			    			if (data[elem].URLs[i] === url)
			    				num ++;
			    			else {
			    				myData.push({url: url, similarity: Math.log(num)/(Math.exp(data[elem].distance) * Math.exp(data[elem].timeDifference))})
			    				url = data[elem].URLs[i]
			    				num = 1
			    			}
			    		}
			    		myData.push({url: url, similarity: Math.log(num)/(Math.exp(data[elem].distance) * Math.exp(data[elem].timeDifference))})
			    	}
					myData.sort(function (a,b){
						return a.similarity - b.similarity
					})    	
					var finalURLs = []
					var num = 0
					for (var elem in myData){
						var url = myData[elem].url
						var bre = false
						for (var stuff in finalURLs){
							if (finalURLs[stuff] === url)
								bre = true
						}
						if (!bre){
							finalURLs.push(url)
							num++
						}
						if (num == 5) {
							break;
						}
					}
					console.log(new Date().getTime() - start)
					lastSuggestions = finalURLs.sort()
					cb(finalURLs.sort())
	        	});
	        }
    	});
	}else {
    	//TODO: Do the hell out of this. What's antoine got?
    	cb([])
    }
}

getTabSuggestions(function(urls){});

/* Changes the suggestion options. */
function setSuggestionOptions(newOptions) {
    for (var attr in newOptions) {
        options[attr] = newOptions[attr]
    }
}

$(document).ready(function(){
	if (lastSuggestions.length != 0) {
		console.log("Displaying last suggestions!");
		DomChanger.displaySuggestions(lastSuggestions)
	}
	getTabSuggestions(function(urls){
		DomChanger.displaySuggestions(urls)
		chrome.storage.sync.set({lastSuggestions: urls}, function(){})
		setInterval(function(){
			getTabSuggestions(function(urls){
				DomChanger.displaySuggestions(urls)
				chrome.storage.sync.set({lastSuggestions: urls}, function(){})
			})
		}, 300)
	})
})

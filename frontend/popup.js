var options = {
    timePeriod: "current",
    lastLocation: {
        latitude: 0,
        longitude: 0
    },
    personal: "yes"
}

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
	console.log("Got a message!");

	data = req.data;
	var data2 = chrome.storage.sync.get("data")
	data2.push(data)
	chrome.storage.sync.set({data: data2}, function() {})

 	sendResponse({ok: 1});
});

/* Returns a list of urls that you should open*/
function getTabSuggestions(cb) {
    if (options.personal === "yes"){
    	console.log("Getting data!")
    	chrome.storage.sync.get("data", function(data){
	    	var lat = 0
	    	var lon = 0
	    	var time = (new Date()).getTime()
	    	console.log(data)
	    	if (navigator.geolocation) {
	        	navigator.geolocation.getCurrentPosition(function (position){
	        		lat = position.coords.latitude
	        		lon = position.coords.longitude
	        		console.log("Position: " + latitude + " ; " + longitude)
					for (elem in data){
			    		var d1 = lat - data[elem].location.latitude 
			    		var d2 = lon - data[elem].location.longitude
			    		var d3 = Math.abs(data[elem].time - time)
			    		data[elem].distance = Math.sqrt(d1*d1 + d2*d2)
			    		data[elem].timeDiffrence = d3
			    	}

			    	data.sort(function (a, b){
			    		a.distance - b.distance
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

					for (var elem in myData){
						var url = myData[elem].url
						var bre = false
						var num = 0
						for (var stuff in finalURLs){
							if (finalURLs[stuff] === url)
								bre = true
						}
						if (!bre){
							finalURLs.push(url)
							num++
						}
						if (num == 5)
							break;
					}
					cb(finalURLs)
	        	});
	        }
    	});
	}else {
    	//TODO: Do the hell out of this. What's antoine got?
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
	var urls = getTabSuggestions(function(urls){
		console.log(urls)
	})
	// DomChanger.displaySuggestions(urls)
})



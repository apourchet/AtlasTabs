
chrome.storage.sync.clear(function() {
});


function send_data() {
	loop(function(currentTabs){
		var lat = 0;
		var lon = 0;
		if (navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(function (position){
		    	console.log("Got the geolocation!!!	")
			   	lat = position.coords.latitude
			   	lon = position.coords.longitude
			   	// console.log({URLs: currentTabs, time: new Date().getTime(), location: {latitude: lat, longitude: lon}, distance: -1, timeDifference: -1})
			   	chrome.runtime.sendMessage({URLs: currentTabs, time: new Date().getTime(), location: {latitude: lat, longitude: lon}, distance: -1, timeDifference: -1}, function(response) {
				});
	   		}, function(err){ console.log("Geolocation error: " + err)})
		}
	});
}

function loop(cb) {
	chrome.windows.getAll({populate:true},function(windows){
	  windows.forEach(function(window){
	  	var currentTabs = []
	    window.tabs.forEach(function(tab){
	      //collect all of the urls here, I will just log them instead
	      //console.log(tab.url);
	      currentTabs.push(tab.url) 
	    });
	    console.log(currentTabs)
	    cb(currentTabs)
	  });
	});
}
send_data()
setInterval(send_data, 1000);

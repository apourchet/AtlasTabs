
chrome.storage.local.clear(function() {
});
var currentTabs = [];

function send_data() {
	currentTabs = []
	loop()
	var lat = 0;
	var lon = 0;
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function (position){
		   	lat = position.coords.latitude
		   	lon = position.coords.longitude
   		})
	}
	console.log({URLs: currentTabs, time: new Date().getTime(), location: {latitude: lat, longitude: lon}, distance: -1, timeDifference: -1})
	chrome.runtime.sendMessage({URLs: currentTabs, time: new Date().getTime(), location: {latitude: lat, longitude: lon}, distance: -1, timeDifference: -1}, function(response) {
	});
}

function loop() {
	chrome.tabs.getAllInWindow(null, function(tabs) {
		for (var i in tabs) {
			currentTabs.push(tabs[i].url) 
		}
	});
}

setInterval(send_data, 1000);

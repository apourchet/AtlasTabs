var DomChanger = {}

DomChanger.displaySuggestions = function(urls, k) {
    if (!urls || urls.length == 0) {
        return
    }
    var n = k || 5
    console.log("Displaying new suggestions!");
    var container = document.getElementById("list-container");
    var items = container.childNodes;
    var l = items.length;
    for (var i = 0; i < l; i++) {
        container.removeChild(items[0]);
    }
    for (var i in urls) {
        if (i >= n) {
            break
        }
        var url = urls[i];
        var newDiv = document.createElement("li");
        newDiv.innerHTML = '<a href=http://' + url + '>' + url + '</a>';
        newDiv.setAttribute('class', 'list-group-item');
        container.appendChild(newDiv);
    }
}

DomChanger.openTabs = function(urls) {
    var createProperties = {
        active: false,
        selected: false
    };
    for (var i in urls) {
        var url = urls[i]
        if (url.indexOf("http") != 0) {
            url = "http://" + url
        }
        createProperties.url = url
        chrome.tabs.create(createProperties, function(tab) {});
    }
}


$(document).ready(function(){
    console.log("Ready!!");
});

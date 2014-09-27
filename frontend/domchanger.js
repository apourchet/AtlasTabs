var DomChanger = {}

DomChanger.displaySuggestions = function(urls) {
    if (!urls || urls.length == 0) {
        return
    }
    console.log("Displaying new suggestions!");
    var container = document.getElementById("list-container");
    var items = container.childNodes;
    var l = items.length;
    for (var i = 0; i < l; i++) {
        container.removeChild(items[0]);
    }
    for (var i in urls) {
        var url = urls[i];
        var newDiv = document.createElement("div");
        newDiv.innerHTML = url;
        container.appendChild(newDiv);
    }
}

$(document).ready(function(){
    console.log("Ready!!");
});

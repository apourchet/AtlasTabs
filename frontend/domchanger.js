var DomChanger = {}

DomChanger.displaySuggestions = function(urls) {
    console.log("Displaying new suggestions!");
    var container = document.getElementById("list-container");
    var items = container.childNodes;
    var l = items.length;
    for (var i = 0; i < l; i++) {
        container.removeChild(items[0]);
    }
    for (var i in urls) {
        var url = urls[i];
        console.log("Displaying '" + url + "'");
        var newDiv = document.createElement("div");
        newDiv.innerHTML = url;
        container.appendChild(newDiv);
    }
}

$(document).ready(function(){
    console.log("Ready!!");
    DomChanger.displaySuggestions(["www.google.com", "google2.com", "google3.com"]);
    setInterval(function() {DomChanger.displaySuggestions([Math.random(), Math.random() + "", Math.random() + "", Math.random() + ""]);}, 4000);
});
